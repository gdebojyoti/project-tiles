import React from 'react'

import './styles.css'

const RootLayout = ({ children }) =>  {
  return (
    <html lang="en">
      <head>
        <title>Project Tiles | Relaxing puzzles filled with vibrant colors</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <meta name="description" content="Project Tiles is an immersive web-based game that offers a tranquil and engaging puzzle experience filled with vibrant colors" />
        <meta name="keywords" content="Project Tiles, puzzle game, colorful challenges, relaxing pattern matching, brain teasers, casual gaming, interactive puzzles, web-based game" />
        <meta name="author" content="Debojyoti Ghosh" />

        {/* font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" /> */}
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;500&display=swap" rel="stylesheet" />
        {/* <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;500&display=swap" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" /> */}

        {/* inline styles */}
        <style>
          {`
            html, body { background-color: #4CB8C4; }
            // body { opacity: 0; }
          `}
        </style>
      </head>
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
