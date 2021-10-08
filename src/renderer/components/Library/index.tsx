import React, { useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/layout';
import LibraryBook from '@/renderer/components/LibraryBook';
import { BookModel } from '@/shared/models/book';
import CommonProps from '@/renderer/scripts/common-props';

const rendererPath = window['pathApi'].rendererPath;
const libraryUrl = window['envApi'].isDevelopment
  ? window['pathApi'].resolve(rendererPath, '..', '..', 'library')
  : '/library';

type LibraryProps = CommonProps;

export default function Library(props: LibraryProps) {
  const [books, setBooks] = useState<BookModel[]>([]);

  useEffect(() => {
    window['bookApi']
      .importFolder(libraryUrl)
      .then((foundBooks: BookModel[]) => {
        if (foundBooks) {
          setBooks(foundBooks);
        }
      })
      .catch((err: Error) => {
        throw `Error getting your books! ${err}`;
      });
  }, []);

  const testDetails = {
    enable: true,
    status: 'UNREAD',
    progress: 0
  };

  window.onmessage = (event) => {
    console.log('In library: ', event.data as string);
    window['bookApi']
      .importFolder(event.data)
      .then((foundBooks: BookModel[]) => {
        if (foundBooks) {
          const updatedBooks = [...books, ...foundBooks];
          setBooks(updatedBooks);
        }
      })
      .catch((err: Error) => {
        throw `Error getting your books! ${err}`;
      });
  };

  return (
    <LibraryContainer>
      {books.map((book: BookModel, key: number) => {
        return <LibraryBook key={key} book={book} details={testDetails} />;
      })}
    </LibraryContainer>
  );
}

function LibraryContainer(props: CommonProps) {
  return (
    <>
      <Flex
        flexWrap='wrap'
        justifyContent='space-between'
        padding='15px'
        className='library-container file-upload-drag-zone'
      >
        {props.children}
      </Flex>
    </>
  );
}
