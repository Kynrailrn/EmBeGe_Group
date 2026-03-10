<?php
include "koneksi.php";

if(isset($_POST['submit'])){

$nama = $_POST['nama_menu'];
$kalori = $_POST['kalori'];
$deskripsi = $_POST['deskripsi'];

$foto = $_FILES['foto']['name'];
$tmp = $_FILES['foto']['tmp_name'];

if($foto != ""){
    move_uploaded_file($tmp, "uploads/".$foto);
}

$query = "INSERT INTO menus (nama_menu, kalori, deskripsi, foto_url)
VALUES ('$nama','$kalori','$deskripsi','$foto')";

mysqli_query($conn,$query);

header("Location: menu_list.php");
}
?>

<link rel="stylesheet" href="style.css">

<h2>Tambah Menu</h2>

<form method="POST" enctype="multipart/form-data">

<label>Nama Menu</label><br>
<input type="text" name="nama_menu" required><br><br>

<label>Kalori</label><br>
<input type="number" name="kalori" required><br><br>

<label>Deskripsi</label><br>
<textarea name="deskripsi" required></textarea><br><br>

<label>Foto Menu</label><br>
<input type="file" name="foto" accept="image/*" required><br><br>

<button type="submit" name="submit">Simpan Menu</button>

</form>