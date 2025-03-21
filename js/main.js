let eventBus = new Vue();

Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>
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
    };
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
        };
        eventBus.$emit('review-submitted', productReview);
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

Vue.component('product-tabs', {
  template: `
    <div>
      <ul>
        <span class="tab"
              :class="{ activeTab: selectedTab === tab }"
              v-for="(tab, index) in tabs"
              @click="selectedTab = tab"
        >{{ tab }}</span>
      </ul>
      <div v-show="selectedTab === 'Reviews'">
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
      <div v-show="selectedTab === 'Make a Review'">
        <product-review @review-submitted="addReview"></product-review>
      </div>
      <div v-show="selectedTab === 'Shipping'">
        <p>Shipping: {{ shipping }}</p>
      </div>
      <div v-show="selectedTab === 'Details'">
        <ul>
          <li v-for="detail in details">{{ detail }}</li>
        </ul>
      </div>
    </div>
  `,
  props: {
    reviews: {
      type: Array,
      required: true
    },
    shipping: {
      type: String,
      required: true
    },
    details: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
      selectedTab: 'Reviews'
    };
  },
  methods: {
    addReview(productReview) {
      this.$emit('review-submitted', productReview);
    }
  }
});


Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    },
    cart: {
      type: Array,
      required: true
    },
    isDiscountApplied: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div class="product">
      <div class="product-image">
        <img :src="image" :alt="altText"/>
      </div>
      <div class="product-info">
        <h1>{{ title }}</h1>
        <p>Цена: {{ discountedPrice }} $</p>
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
          @mouseover="updateProduct(index)"
        ></div>
        <button
          v-on:click="addToCart"
          :disabled="!inStock"
          :class="{ disabledButton: !inStock }"
        >
          Add to cart
        </button>
      </div>
      <product-tabs :reviews="reviews" :shipping="shipping" :details="details" @review-submitted="addReview"></product-tabs>
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
          variantQuantity: 10,
          price: 10.99
        },
        {
          variantId: 2235,
          variantColor: 'blue',
          variantImage: "./assets/vmSocks-blue-onWhite.jpg",
          variantQuantity: 10,
          price: 10.99
        }
      ],
      reviews: []
    };
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant]);
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
      return this.variants[this.selectedVariant].variantQuantity;
    },
    shipping() {
      return this.premium ? "Free" : "$2.99";
    },
    discountedPrice() {
      const price = this.variants[this.selectedVariant].price;
      return this.isDiscountApplied ? (price * 0.7).toFixed(2) : price.toFixed(2);
    }
  },
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview);
    });
  }
});


let app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: [],
    showAdditionalAccessories: false
  },
  methods: {
    updateCart(item) {
      this.cart.push(item);
      this.showAdditionalAccessories = true;
    },
  
    removeFromCart(index) {
      this.cart.splice(index, 1);
    },
    clearCart() {
      this.cart = [];
    },
    getItemName(item) {
      if (item.variantId) {
        return `Socks - ${item.variantColor}`;
      } else if (item.name) {
        return item.name;
      } else {
        return 'Unknown item';
      }
    }
  },
  computed: {
    showDiscountMessage() {
      return this.cart.length === 0; 
    },
    isDiscountApplied() {
      return this.cart.length === 0; 
    }
  }
});
