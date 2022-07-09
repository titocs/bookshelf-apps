module.exports = {
    content: ["./src/**/*.{html,js}", "./index.html"],
    theme: {
        extend: {},
        fontFamily: {
            'Lato': ['Lato', 'sans-serif'],
        },
        keyframes: {
            enterModal: {
                '0%': {
                    opacity: 0.5
                },
                '100%': {
                    opacity: 1
                }
            },
            leaveModal: {
                '0%': {
                    opacity: 1
                },
                '100%': {
                    opacity: 0
                }
            }
        },
        animation: {
            enterModal: 'enterModal 650ms',
            leaveModal: 'leaveModal 650ms',
        },
    },
    plugins: [],
  }