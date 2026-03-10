<?php
include "koneksi.php";

$query = "SELECT * FROM menus";
$result = mysqli_query($conn,$query);
?>

<link rel="stylesheet" href="style.css">

<h2>Perencanaan Menu</h2>

<a href="menu_add.php" class="btn">+ Tambah Menu</a>

<table>
<tr>
<th>ID</th>
<th>Nama Menu</th>
<th>Kalori</th>
<th>Deskripsi</th>
<th>Foto</th>
</tr>

<?php while($row = mysqli_fetch_assoc($result)){ ?>

<tr>
<td><?php echo $row['id']; ?></td>
<td><?php echo $row['nama_menu']; ?></td>
<td><?php echo $row['kalori']; ?></td>
<td><?php echo $row['deskripsi']; ?></td>
<td>
<img src="uploads/<?php echo $row['foto_url']; ?>" width="80">
</td>

</tr>

<?php } ?>

</table>