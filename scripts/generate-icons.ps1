$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$publicDirectory = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../public'))
$source = [System.Drawing.Image]::FromFile((Join-Path $publicDirectory 'logo.png'))
try {
  $frames = @()
  foreach ($size in @(16, 32, 48, 64, 180, 192, 256, 512)) {
    $bitmap = [System.Drawing.Bitmap]::new($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $scale = [Math]::Min($size / $source.Width, $size / $source.Height)
    $width = [int]($source.Width * $scale)
    $height = [int]($source.Height * $scale)
    $graphics.DrawImage($source, [int](($size - $width) / 2), [int](($size - $height) / 2), $width, $height)
    $stream = [System.IO.MemoryStream]::new()
    $bitmap.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
    $bytes = $stream.ToArray()
    if ($size -in @(16, 32, 48, 64, 256)) { $frames += @{ Size = $size; Bytes = $bytes } }
    if ($size -in @(180, 192, 256, 512)) {
      $name = if ($size -eq 180) { 'apple-touch-icon.png' } else { "logo-$size.png" }
      [System.IO.File]::WriteAllBytes((Join-Path $publicDirectory $name), $bytes)
    }
    $stream.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
  }
  $file = [System.IO.File]::Create((Join-Path $publicDirectory 'favicon.ico'))
  $writer = [System.IO.BinaryWriter]::new($file)
  try {
    $writer.Write([uint16]0); $writer.Write([uint16]1); $writer.Write([uint16]$frames.Count)
    $offset = 6 + 16 * $frames.Count
    foreach ($frame in $frames) {
      $dimension = if ($frame.Size -eq 256) { 0 } else { $frame.Size }
      $writer.Write([byte]$dimension); $writer.Write([byte]$dimension)
      $writer.Write([byte]0); $writer.Write([byte]0)
      $writer.Write([uint16]1); $writer.Write([uint16]32)
      $writer.Write([uint32]$frame.Bytes.Length); $writer.Write([uint32]$offset)
      $offset += $frame.Bytes.Length
    }
    foreach ($frame in $frames) { $writer.Write([byte[]]$frame.Bytes) }
  } finally { $writer.Dispose() }
} finally { $source.Dispose() }
