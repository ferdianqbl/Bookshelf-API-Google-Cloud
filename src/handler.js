const { nanoid } = require('nanoid');
const books = require('./books');

// primary
const addBookHandler = (req, res) => {
  // declare all key
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  // input checking
  if (year === undefined) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi tahun buku',
    });

    response.code(400);
    return response;
  }

  if (summary === undefined) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi summary buku',
    });

    response.code(400);
    return response;
  }

  if (name === undefined) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (author === undefined) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi author buku',
    });

    response.code(400);
    return response;
  }

  if (reading === undefined) {
    const response = res.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. Mohon isi status sudah dibaca atau belum',
    });

    response.code(400);
    return response;
  }

  if (publisher === undefined) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi publisher buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = res.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = res.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = res.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);
  return response;
};

const getAllBooksHandler = (req, res) => {
  const { name, reading, finished } = req.query;

  let getBooksSuccess = [...books];

  // book filter by name
  if (name !== undefined) { getBooksSuccess = books.filter((book) => new RegExp(name, 'i').exec(book.name)); }

  // book filter by reading
  if (reading !== undefined) {
    getBooksSuccess = books.filter(
      (book) => Number(book.reading) === Number(reading),
    );
  }

  // book filter by finished
  if (finished !== undefined) {
    getBooksSuccess = books.filter(
      (book) => Number(book.finished) === Number(finished),
    );
  }

  const response = res.response({
    status: 'success',
    data: {
      books: getBooksSuccess.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  response.code(200);
  return response;
};

const getBookDetailHandler = (req, res) => {
  const { bookId } = req.params;

  const book = books.filter((item) => item.id === bookId)[0];

  if (book !== undefined) {
    const response = res.response({
      status: 'success',
      data: {
        book,
      },
    });

    response.code(200);
    return response;
  }

  const response = res.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

const editBookHandler = (req, res) => {
  const { bookId } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  const updatedAt = new Date().toISOString();

  // input checking
  if (name === undefined) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (year === undefined) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi tahun buku',
    });

    response.code(400);
    return response;
  }

  if (author === undefined) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi author buku',
    });

    response.code(400);
    return response;
  }

  if (summary === undefined) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi summary buku',
    });

    response.code(400);
    return response;
  }

  if (publisher === undefined) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi publisher buku',
    });

    response.code(400);
    return response;
  }

  if (reading === undefined) {
    const response = res.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. Mohon isi status sudah dibaca atau belum',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = res.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  // find old book
  const indexOldBook = books.findIndex((book) => book.id === bookId);

  if (indexOldBook !== -1) {
    books[indexOldBook] = {
      ...books[indexOldBook],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = res.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  const response = res.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

const deleteBookHandler = (req, res) => {
  const { bookId } = req.params;

  const bookIndexWillBeDeleted = books.findIndex((book) => book.id === bookId);

  if (bookIndexWillBeDeleted !== -1) {
    books.splice(bookIndexWillBeDeleted, 1);

    const response = res.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = res.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookDetailHandler,
  editBookHandler,
  deleteBookHandler,
};
