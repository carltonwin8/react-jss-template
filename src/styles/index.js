module.exports = {
  button: {
    background: "pink",
    color: "white",
    fontSize: 14,
    "&:hover": {
      background: "blue"
    }
  },
  ctaButton: {
    extend: "button",
    background: "blue",
    fontWeight: "bold"
  },
  "@media (min-width: 1024px)": {
    button: {
      width: 200
    }
  }
};
