Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name" required>
      </p>
 
      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review" required></textarea>
      </p>
 
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating" required>
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
 
      <p>
        <label>Would you recommend this product?</label>
        <input type="radio" id="yes" value="Yes" v-model="recommend">
        <label for="yes">Yes</label>
        <input type="radio" id="no" value="No" v-model="recommend">
        <label for="no">No</label>
      </p>
 
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>
 
      <p>
        <input type="submit" value="Submit"> 
      </p>
    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            this.errors = []; 
 
            if (this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
                this.$emit('review-submitted', productReview);
                
                this.name = null;
                this.review = null;
                this.rating = null;
                this.recommend = null;
            } else {
                if (!this.name) this.errors.push("Name required.");
                if (!this.review) this.errors.push("Review required.");
                if (!this.rating) this.errors.push("Rating required.");
                if (!this.recommend) this.errors.push("Recommendation required.");
            }
        }
    }
 });
 
 Vue.component('product', {
    template: `
    <div class="product">
      <div class="product-image">
         <img :src="image" :alt="altText"/>
      </div>
 
      <div class="product-info">
          <h1>{{ title }}</h1>
          <p v-if="inStock">In stock</p>
          <p v-else>Out of Stock</p>
          <ul>
              <li v-for="detail in details">{{ detail }}</li>
          </ul>
          <p>Shipping: {{ shipping }}</p>
          <div
              class="color-box"
              v-for="(variant, index) in variants"
              :key="variant.variantId"
              :style="{ backgroundColor: variant.variantColor }"
              @mouseover="updateProduct(index)">
          </div>
 
          <button
              v-on:click="addToCart"
              :disabled="!inStock"
              :class="{ disabledButton: !inStock }">
              Add to cart
          </button>
      </div>
 
      <product-review @review-submitted="addReview"></product-review>
 
      <div>
        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul>
          <li v-for="review in reviews">
            <p>{{ review.name }}</p>
            <p>Rating: {{ review.rating }}</p>
            <p>{{ review.review }}</p>
            <p>Recommended: {{ review.recommend }}</p>
          </li>
        </ul>
      </div>
    </div>
    `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            selectedVariant: 0,
            altText: "A pair of socks",
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
            reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
        addReview(productReview) {
            this.reviews.push(productReview);
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity > 0;
        },
        shipping() {
            return this.premium ? "Free" : 2.99;
        }
    }
 });
 
 let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        }
    }
 });
 