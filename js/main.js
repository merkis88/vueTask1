let app = new Vue({
    el: '#app',
    data: {
        brand: "Vue Mastery",
        product: "Socks",
        image: "./assets/vmSocks-green-onWhite.jpg",
        altText: "A pair of socks",
        inStock: true,
        onSale: true,
        cart: 0,
        details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        variants: [
            {
                variantId: 2234,
                variantColor: 'green',
                variantImage: "./assets/vmSocks-green-onWhite.jpg",
                variantQuantity: 10

            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                variantQuantity: 0

            }
        ],
    },
    methods: {
        addToCart() {
            if (this.inStock) {
                this.cart += 1;
            }
        },
        removeFromCart() {
            if (this.cart > 0) {
                this.cart -= 1;
            }
        },
        updateProduct(variantImage) {
            this.image = variantImage;
        }
    }, 

    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },

        sale() {
            return this.onSale ? `${this.brand} ${this.product} на распродаже!` : `${this.brand} ${this.product} не участвует в распродаже.`;
        }
    }
})
