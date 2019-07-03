const React = require("react");

module.exports = props => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link rel="stylesheet" type="text/css" href="styles.css" />
        <title>React Template</title>
      </head>
      <body>{props.children}</body>
    </html>
  );
};
