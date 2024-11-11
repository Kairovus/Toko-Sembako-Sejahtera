import mysql from 'mysql2';
import inquirer from 'inquirer';
import moment from 'moment';

// Konfigurasi koneksi
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'bnsp'
});

// Koneksi ke database
connection.connect((err) => {
    if (err) {
        console.error('Koneksi gagal: ' + err.stack);
        return;
    }
    console.log('Terhubung ke database.\nSelamat datang di Toko Beras Padi Jaya.');
    mainMenu();
});

// Fungsi untuk menampilkan main menu
function mainMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'userAction',
                message: 'Silahkan pilih salah satu opsi berikut:',
                choices: [
                    'Lihat Stok Produk',
                    'Cari Produk',
                    'Transaksi',
                    'Tambah Produk',
                    'Hapus Produk',
                    'Daftar Transaksi',
                    'Cari Transaksi',
                    'Keluar'
                ]
            }
        ])
        .then((actionAnswer) => {
            switch (actionAnswer.userAction) {
                case 'Lihat Stok Produk':
                    lihatStok();
                    break;
                case 'Cari Produk':
                    cariProduk();
                    break;
                case 'Transaksi':
                    transaksi();
                    break;
                case 'Tambah Produk':
                    tambahProduk();
                    break;
                case 'Hapus Produk':
                    hapusProduk();
                    break;
                case 'Daftar Transaksi':
                    daftarTransaksi();
                    break;
                case 'Cari Transaksi':
                    cariTransaksi();
                    break;
                case 'Keluar':
                    connection.end();
                    break;
            }
        })
        .catch((error) => {
            console.error('Error during prompt:', error);
            connection.end();
        });
}

// Fungsi untuk melihat stok produk
function lihatStok() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM produk', (error, results) => {
            if (error) {
                console.error('Error fetching data:', error);
                reject(error); // Reject the promise on error
            } else {
                console.log('Data Stok Produk:');
                results.forEach((row) => {
                    console.log(
                        `No: ${row.no_produk}, Merk: ${row.merk}, Ukuran: ${row.ukuran}, Harga Jual: Rp.${row.harga_jual}, Stok: ${row.stok}`
                    );
                });
                resolve(results); // Resolve with results
            }
            mainMenu(); // Call mainMenu regardless of success or failure
        });
    });
}

// Fungsi
function tambahProduk() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'merk',
                message: 'Nama Produk:',
                validate: (input) => input ? true : 'Nama produk tidak boleh kosong!'
            },
            {
                type: 'input',
                name: 'ukuran',
                message: 'Berat Produk:',
                validate: (input) => !isNaN(input) && input > 0 ? true : 'Berat harus berupa angka positif!'
            },
            {
                type: 'input',
                name: 'harga_jual',
                message: 'Harga Jual:',
                validate: (input) => !isNaN(input) && input >= 0 ? true : 'Harga jual harus berupa angka positif!'
            },
            {
                type: 'input',
                name: 'stok',
                message: 'Jumlah Stok:',
                validate: (input) => !isNaN(input) && input >= 0 ? true : 'Stok harus berupa angka positif!'
            }
        ])
        .then((answers) => {
            const { merk, ukuran, harga_jual, stok } = answers;
            const query = 'INSERT INTO produk (merk, ukuran, harga_jual, stok) VALUES (?, ?, ?, ?)';
            connection.query(query, [merk, ukuran, harga_jual, stok], (error) => {
                if (error) {
                    console.error('Error adding product:', error);
                } else {
                    console.log('Produk berhasil ditambahkan.');
                }
                mainMenu();
            });
        })
        .catch((error) => {
            console.error('Error during adding product prompt:', error);
            mainMenu();
        });
}

// Fungsi untuk menghapus produk
function hapusProduk() {
    connection.query('SELECT * FROM produk', (error, results) => {
        if (error) {
            console.error('Error fetching products:', error);
            mainMenu();
            return;
        }

        const productChoices = results.map((row) => ({
            name: `${row.merk} (${row.ukuran}) - Harga: Rp.${row.harga_jual} - Stok: ${row.stok}`,
            value: row.no_produk
        }));

        inquirer
            .prompt([{
                type: 'list',
                name: 'no_produk',
                message: 'Pilih produk yang ingin dihapus:',
                choices: productChoices
            }])
            .then((answers) => {
                const query = 'DELETE FROM produk WHERE no_produk = ?';
                connection.query(query, [answers.no_produk], (error) => { // Updated reference here
                    if (error) {
                        console.error('Error deleting product:', error);
                    } else {
                        console.log('Produk berhasil dihapus.');
                    }
                    mainMenu();
                });
            })
            .catch((error) => {
                console.error('Error during delete product prompt:', error);
                mainMenu();
            });
    });
}

// Fungsi transaksi
function transaksi() {
    connection.query('SELECT * FROM produk', (error, results) => {
        if (error) {
            console.error('Error fetching data:', error);
            mainMenu();
            return;
        }

        const productChoices = results.map((row) => ({
            name: `${row.merk} (${row.ukuran}) - Harga: Rp.${row.harga_jual} - Stok: ${row.stok}`,
            value: {
                no_produk: row.no_produk,
                stok: row.stok,
                merk: row.merk,
                ukuran: row.ukuran,
                harga_jual: row.harga_jual
            }
        }));

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'nama_pelanggan',
                    message: 'Nama Pelanggan:',
                    validate: (input) => input ? true : 'Nama pelanggan tidak boleh kosong!'
                },
                {
                    type: 'input',
                    name: 'tanggal',
                    message: 'Pilih Tanggal Transaksi (format: YYYY-MM-DD):',
                    validate: (input) => moment(input, 'YYYY-MM-DD', true).isValid() ? true : 'Format tanggal tidak valid! Gunakan YYYY-MM-DD.'
                },
                {
                    type: 'input',
                    name: 'keterangan',
                    message: 'Keterangan (optional):'
                },
                {
                    type: 'checkbox',
                    name: 'selectedProducts',
                    message: 'Pilih produk yang ingin Anda jual:',
                    choices: productChoices
                }
            ])
            .then((saleAnswers) => {
                if (saleAnswers.selectedProducts.length > 0) {
                    const quantityPrompts = saleAnswers.selectedProducts.map((product) => ({
                        type: 'input',
                        name: `quantity_${product.no_produk}`,
                        message: `Masukkan jumlah untuk ${product.merk} (Stok tersedia: ${product.stok}):`,
                        validate: (input) => {
                            const quantity = parseInt(input);
                            if (isNaN(quantity) || quantity <= 0 || quantity > product.stok) {
                                return 'Jumlah harus berupa angka positif dan tidak melebihi stok!';
                            }
                            return true;
                        }
                    }));

                    inquirer
                        .prompt(quantityPrompts)
                        .then((quantityAnswers) => {
                            let totalSale = 0;
                            const selectedProducts = saleAnswers.selectedProducts.map((product) => {
                                const quantity = parseInt(quantityAnswers[`quantity_${product.no_produk}`]);
                                const totalPrice = product.harga_jual * quantity;
                                totalSale += totalPrice;
                                return {
                                    ...product,
                                    quantity,
                                    totalPrice
                                };
                            });

                            const tax = totalSale * 0.1; // 10% tax
                            const totalWithTax = totalSale + tax;

                            console.log('\nRingkasan Transaksi:');
                            console.log(`Tanggal Transaksi: ${saleAnswers.tanggal}`);
                            console.log(`Nama Pembeli: ${saleAnswers.nama_pelanggan}`);
                            console.log(`Keterangan: ${saleAnswers.keterangan || '-'}`);
                            selectedProducts.forEach((product) => {
                                console.log(
                                    `Produk: ${product.merk}, Ukuran: ${product.ukuran}, Jumlah: ${product.quantity}, Harga Total: Rp.${product.totalPrice}`
                                );
                            });
                            console.log(`Subtotal: Rp.${totalSale}`);
                            console.log(`Pajak (10%): Rp.${tax}`);
                            console.log(`Total dengan Pajak: Rp.${totalWithTax}\n`);

                            // Confirm the transaction
                            inquirer
                                .prompt([
                                    {
                                        type: 'confirm',
                                        name: 'confirmTransaction',
                                        message: 'Apakah Anda yakin ingin melanjutkan transaksi ini?',
                                        default: false
                                    }
                                ])
                                .then((confirmAnswer) => {
                                    if (confirmAnswer.confirmTransaction) {
                                        insertTransaction(saleAnswers.tanggal, totalSale, tax, totalWithTax, saleAnswers.nama_pelanggan, saleAnswers.keterangan, selectedProducts);
                                    } else {
                                        console.log('Transaksi dibatalkan.');
                                        mainMenu();
                                    }
                                });
                        });
                } else {
                    console.log("Tidak ada produk yang dipilih untuk transaksi.");
                    mainMenu();
                }
            });
    });
}


// Fungsi untuk menyisipkan transaksi ke database
function insertTransaction(tanggal, totalSale, tax, totalWithTax, customerName, keterangan, selectedProducts) {
    // Validate that selectedProducts is an array
    if (!Array.isArray(selectedProducts) || selectedProducts.length === 0) {
        console.error('Error: selectedProducts must be a non-empty array.');
        mainMenu();
        return;
    }

    // Insert into transaksi table
    const transactionQuery = 'INSERT INTO transaksi (tanggal, nama_pelanggan, Keterangan) VALUES (?, ?, ?)';
    const transactionData = [tanggal, customerName, keterangan]; // Added keterangan here

    connection.query(transactionQuery, transactionData, (error, result) => {
        if (error) {
            console.error('Error inserting transaction:', error);
            mainMenu();
            return;
        }

        const transactionId = result.insertId;

        // Prepare data for produk_transaksi table
        const transactionProductQuery = 'INSERT INTO produk_transaksi (no_transaksi, no_produk, merk, ukuran, jumlah) VALUES ?';
        const transactionProductData = selectedProducts.map((product) => [
            transactionId,
            product.no_produk,
            product.merk,
            product.ukuran,
            product.quantity
        ]);

        connection.query(transactionProductQuery, [transactionProductData], (error) => {
            if (error) {
                console.error('Error inserting transaction products:', error);
            } else {
                console.log('Transaksi berhasil disimpan.');
                updateStock(selectedProducts); // Update stock after successful insertion
            }
            mainMenu();
        });
    });
}

// Fungsi untuk memperbarui stok setelah transaksi
function updateStock(selectedProducts) {
    selectedProducts.forEach((product) => {
        const newStock = product.stok - product.quantity;
        const updateStockQuery = 'UPDATE produk SET stok = ? WHERE no_produk = ?';

        connection.query(updateStockQuery, [newStock, product.no_produk], (error) => {
            if (error) {
                console.error(`Error updating stock for product ${product.merk}:`, error);
            }
        });
    });
}

// Fungsi untuk menampilkan daftar transaksi
function daftarTransaksi() {
    const query = `
        SELECT 
    t.no_transaksi, 
    t.tanggal, 
    t.nama_pelanggan, 
    p.merk, 
    p.ukuran, 
    pt.jumlah, 
    t.Keterangan
FROM 
    transaksi t LEFT JOIN  produk_transaksi pt ON t.no_transaksi = pt.no_transaksi LEFT JOIN produk p ON pt.no_produk = p.no_produk
ORDER BY 
    t.tanggal DESC;
    `;

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching transactions:', error);
            mainMenu();
            return;
        }

        console.log('\nDaftar Transaksi:');
        if (results.length > 0) {
            results.forEach((row) => {
                console.log(
                    `No Transaksi: ${row.no_transaksi}, Tanggal: ${moment(row.tanggal).format('DD-MM-YYYY')}, ` +
                    `Nama Pelanggan: ${row.nama_pelanggan}, Produk: ${row.merk}, Ukuran: ${row.ukuran}, Jumlah: ${row.jumlah}, Keterangan: ${row.Keterangan} `
                );
            });
        } else {
            console.log('Tidak ada transaksi yang ditemukan.');
        }
        mainMenu();
    });
}

//fungsi untuk mencari produk
function cariProduk() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'merk',
                message: 'Masukkan nama produk yang ingin dicari (merk):',
                validate: (input) => input ? true : 'Nama produk tidak boleh kosong!'
            }
        ])
        .then((answer) => {
            const { merk } = answer;
            const query = 'SELECT * FROM produk WHERE merk LIKE ?';

            connection.query(query, [`%${merk}%`], (error, results) => {
                if (error) {
                    console.error('Error fetching products:', error);
                } else if (results.length === 0) {
                    console.log('Produk dengan merk tersebut tidak ditemukan.');
                } else {
                    console.log('\nHasil Pencarian Produk:');
                    results.forEach((row) => {
                        console.log(
                            `No: ${row.no_produk}, Merk: ${row.merk}, Ukuran: ${row.ukuran}, Harga Jual: Rp.${row.harga_jual}, Stok: ${row.stok}`
                        );
                    });
                }
                mainMenu(); // Return to the main menu after displaying results
            });
        })
        .catch((error) => {
            console.error('Error during product search prompt:', error);
            mainMenu();
        });
}

//fungsoi mencari transaksi dengan tanggal
function cariTransaksi() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'tanggal',
                message: 'Masukkan tanggal transaksi yang ingin dicari (format: YYYY-MM-DD):',
                validate: (input) => {
                    // check format input
                    return moment(input, 'YYYY-MM-DD', true).isValid()
                        ? true
                        : 'Tanggal harus dalam format YYYY-MM-DD!';
                }
            }
        ])
        .then((answer) => {
            const { tanggal } = answer;
            const query = `
                SELECT 
                    t.no_transaksi, 
                    t.tanggal, 
                    t.nama_pelanggan, 
                    t.keterangan, 
                    p.merk, 
                    p.ukuran, 
                    pt.jumlah 
                FROM 
                    transaksi t
                LEFT JOIN 
                    produk_transaksi pt ON t.no_transaksi = pt.no_transaksi
                LEFT JOIN 
                    produk p ON pt.no_produk = p.no_produk
                WHERE 
                    t.tanggal = ?
                ORDER BY 
                    t.no_transaksi;
            `;

            connection.query(query, [tanggal], (error, results) => {
                if (error) {
                    console.error('Error fetching transactions:', error);
                } else if (results.length === 0) {
                    console.log('Tidak ada transaksi yang ditemukan pada tanggal tersebut.');
                } else {
                    console.log('\nHasil Pencarian Transaksi:');
                    results.forEach((row) => {
                        console.log(
                            `No Transaksi: ${row.no_transaksi}, Tanggal: ${moment(row.tanggal).format('DD-MM-YYYY')}, ` +
                            `Nama Pelanggan: ${row.nama_pelanggan}, Produk: ${row.merk}, Ukuran: ${row.ukuran}, Jumlah: ${row.jumlah}, Keterangan: ${row.Keterangan} `
                        );
                    });
                }
                mainMenu(); // kembali ke main menu setelah mencari transaksi
            });
        })
        .catch((error) => {
            console.error('Error during transaction search prompt:', error);
            mainMenu();
        });
}


