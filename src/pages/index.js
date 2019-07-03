const React = require("react");

const Layout1 = require("../components/layout");

module.exports = () => {
  return (
    <Layout1>
      <h1>Hello World</h1>
      <button className="${classes.button}">hi</button>
    </Layout1>
  );
};
