<template>
  <div id="product" v-if="product">
    <SfBreadcrumbs
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    />
    <div class="product">
      <div class="product__gallery">
        <SfImage
          v-for="(image, i) in productGetters.getGallery(product)" :key="i"
          :src="image.big"
          :width="590"
          :height="700"
        />
      </div>
      <div class="product__description">
        <SfSticky class="product-details">
          <SfHeading
            :title="productGetters.getName(product)"
            :level="1"
            class="sf-heading--no-underline sf-heading--left product-details__heading"
          />
          <SfBadge class="sf-badge--number" :class="productGetters.getStatus(product) ? 'color-success' : 'color-danger'">
            {{ productGetters.getStatus(product) ? 'In stock' : 'Out of Stock' }}
          </SfBadge>
          <div class="product-details__sub">
            <SfPrice
              :regular="productGetters.getFormattedPrice(productGetters.getPrice(product).regular)"
              :special="productGetters.getFormattedPrice(productGetters.getPrice(product).special)"
            />
          </div>
          <p class="product-details__description desktop-only">
            {{ productGetters.getDescription(product) }}
          </p>
          <!-- TODO: add size selector after design is added -->
          <div class="product-details__section" v-if="options.length > 0">
            <template v-for="(option, i) in options">
              <div v-if="option.name === 'size' || option.name === 'Size'" v-bind:key="i">
                <SfSelect
                  :selected="configuration.size"
                  @change="size => updateFilter({ size })"
                  :label="option.name"
                  class="sf-select--underlined product-details__attribute"
                >
                  <SfSelectOption
                    v-for="size in option.values"
                    :key="size.value"
                    :value="size.value"
                  >
                    <SfProductOption :label="size.value" />
                  </SfSelectOption>
                </SfSelect>
              </div>
              <div v-else-if="option.name === 'Color' || option.name === 'Color'" v-bind:key="i">
                <SfSelect
                  :selected="configuration.color"
                  @change="color => updateFilter({ color })"
                  :label="option.name"
                  class="sf-select--underlined product-details__attribute"
                >
                  <SfSelectOption
                    v-for="colorName in option.values"
                    :key="colorName.value"
                    :value="colorName.value"
                  >
                    <SfProductOption :color="colorName.value" :label="colorName.value" />
                  </SfSelectOption>
                </SfSelect>
              </div>
            </template>
          </div>
          <div class="product-details__section">
            <SfAddToCart
              data-cy="product-cart_add"
              :stock="stock"
              v-model="qty"
              :disabled="loading"
              :canAddToCart="stock > 0"
              @click="addToCart(product, parseInt(qty))"
              class="product-details__add-to-cart"
            />
          </div>
          <SfTabs class="product-details__tabs" :openTab="2">
            <SfTab data-cy="product-tab_description" title="Description">
              <div>
                {{ productGetters.getDescription(product, true) }}
              </div>
            </SfTab>
            <SfTab data-cy="product-tab_additional" title="Additional Information">
              <SfHeading
                title="Vendor"
                :level="3"
                class="sf-heading--no-underline sf-heading--left"
              />
              <p>
                {{ productGetters.getVendor(product) }}
              </p>
            </SfTab>
          </SfTabs>
        </SfSticky>
      </div>
    </div>
    <RelatedProducts
      :products="relatedProducts"
      :loading="relatedLoading"
      title="Match it with"
    />
    <InstagramFeed />
    <SfBanner
      image="/homepage/bannerD.png"
      subtitle="Fashion to Take Away"
      title="Download our application to your mobile"
      class="sf-banner--left desktop-only banner-app"
    >
      <template #call-to-action>
        <div class="banner-app__call-to-action">
          <SfImage
            class="banner-app__image"
            src="/homepage/google.png"
            :width="191"
            :height="51"
            alt="Google Play"
          />
          <SfImage
            class="banner-app__image"
            src="/homepage/apple.png"
            :width="174"
            :height="57"
            alt="App Store"
          />
        </div>
      </template>
    </SfBanner>
  </div>
</template>
<script>
import {
  SfProperty,
  SfHeading,
  SfPrice,
  SfRating,
  SfSelect,
  SfProductOption,
  SfAddToCart,
  SfTabs,
  SfGallery,
  SfImage,
  SfBanner,
  SfAlert,
  SfSticky,
  SfReview,
  SfBreadcrumbs,
  SfButton,
  SfColor,
  SfBadge
} from '@storefront-ui/vue';

import InstagramFeed from '~/components/InstagramFeed.vue';
import RelatedProducts from '~/components/RelatedProducts.vue';
import { ref, computed } from '@vue/composition-api';
import { useProduct, useCart, productGetters } from '@vue-storefront/shopify';
import { onSSR } from '@vue-storefront/core';

export default {
  name: 'Product',
  transition: 'fade',
  setup(props, context) {
    const qty = ref(1);
    const { slug } = context.root.$route.params;

    const { products, search } = useProduct('products');
    const { products: relatedProducts, search: searchRelatedProducts, loading: relatedLoading } = useProduct('relatedProducts');
    const { addToCart, loading, loadCart } = useCart();

    const product = computed(() => productGetters.getFiltered(products.value, { master: true, attributes: context.root.$route.query })[0]);
    const productPrice = computed(() => productGetters.getPrice(product));
    const options = computed(() => productGetters.getOptions(product.value));
    const configuration = computed(() => productGetters.getAttributes(product.value, { ...context.root.$route.query }));
    const categories = computed(() => productGetters.getCategoryIds(product.value));
    const breadcrumbs = computed(() => productGetters.getBreadcrumbs ? productGetters.getBreadcrumbs(product.value) : props.fallbackBreadcrumbs);

    onSSR(async () => {
      await loadCart();
      await search({ slug });
      await searchRelatedProducts({ catId: [categories.value[0]], limit: 8 });
    });

    const updateFilter = (filter) => {
      context.root.$router.push({
        path: context.root.$route.path,
        query: { ...configuration.value,
          ...filter }
      });
    };

    return {
      updateFilter,
      configuration,
      product,
      relatedProducts: computed(() => productGetters.getFiltered(relatedProducts.value, { master: true })),
      relatedLoading,
      options,
      qty,
      addToCart,
      loading,
      productGetters,
      productPrice,
      breadcrumbs
    };
  },
  components: {
    SfAlert,
    SfColor,
    SfProperty,
    SfHeading,
    SfPrice,
    SfRating,
    SfSelect,
    SfProductOption,
    SfAddToCart,
    SfTabs,
    SfGallery,
    SfImage,
    SfBanner,
    SfSticky,
    SfReview,
    SfBreadcrumbs,
    SfButton,
    InstagramFeed,
    RelatedProducts,
    SfBadge
  },
  data() {
    return {
      stock: 5,
      detailsIsActive: false,
      fallbackBreadcrumbs: [
        {
          text: 'Home',
          route: {
            link: '#'
          }
        }
      ]
    };
  },
  head () {
    return {
      title: productGetters.getName(this.product) + ' : Shopify PWA'
    };
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
#product {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
}
.section {
  padding: 0 var(--spacer-xl);
  @include for-desktop {
    padding: 0;
  }
}
.breadcrumbs {
  margin: var(--spacer-base) auto var(--spacer-lg);
}
.product {
  @include for-desktop {
    display: flex;
  }
  &__gallery,
  &__description {
    flex: 1;
  }
  &__description {
    padding: 0 var(--spacer-sm);
    @include for-desktop {
      padding: 0;
      margin: 0 0 0 calc(var(--spacer-xl) * 5);
    }
  }
}
.product-property {
  margin: var(--spacer-xs) 0;
}
.product-details {
  &__heading {
    margin: var(--spacer-lg) 0 0 0;
    @include for-desktop {
      margin: var(--spacer-base) 0;
    }
  }
  &__sub {
    @include for-desktop {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
    }
  }
  &__sub-rating {
    display: flex;
    align-items: center;
    margin: var(--spacer-sm) 0 0 0;
    @include for-desktop {
      flex-direction: column;
      align-items:flex-start;
      margin: 0;
    }
  }
    &__colors {
    @include font(
      --product-color-font,
      var(--font-normal),
      var(--font-lg),
      1.6,
      var(--font-family-secondary)
    );
    display: flex;
    align-items: center;
    margin-top: var(--spacer-xl);
  }
  &__color-label {
    margin: 0 var(--spacer-lg) 0 0;
  }
  &__color {
    margin: 0 var(--spacer-2xs);
  }
  &__sub-reviews {
    margin: var(--spacer-2xs) 0 0 0;
    font-size: var(--font-xs);
  }
  &__section {
    border: 1px solid var(--c-light);
    border-width: 0 0 1px 0;
    padding: 0 0 0.625rem 0;
    @include for-desktop {
      border: 0;
      padding: 0;
    }
  }
  &__action {
    display: flex;
    &:not(:last-of-type) {
      margin: var(--spacer-xl) 0 var(--spacer-base);
    }
    @include for-desktop {
      justify-content: flex-end;
    }
  }
  &__add-to-cart {
    margin: var(--spacer-base) 0 0 0;
    @include for-desktop {
      margin: var(--spacer-2xl) 0 0 0;
    }
  }
  &__alert {
    margin: var(--spacer-base) 0 0 0;
  }
  &__attribute {
    margin: 0 0 var(--spacer-xl) 0;
  }
  &__description {
    margin: var(--spacer-xl) 0;
    font-family: var(--font-family-secondary);
    font-size: var(--font-base);
    color: var(--c-dark-variant);
    line-height: 1.6;
    @include for-desktop {
      font-size: var(--font-base);
    }
  }
  &__properties {
    margin: var(--spacer-xl) 0 0 0;
  }
  &__tabs {
    --tabs-title-padding: var(--spacer-sm) 0;
    --tabs-content-tab-padding: var(--spacer-sm) 0;
    margin: var(--spacer-lg) 0 0 0;
    @include for-desktop {
      margin-top: var(--spacer-2xl);
    }
  }
  &__review {
    padding: var(--spacer-xl) 0;
    border: 1px solid var(--c-light);
    border-width: 0 0 1px 0;
  }
}
.product-carousel {
  margin: 0 calc(var(--spacer-xl) * -1) 0 0;
  @include for-desktop {
    margin: var(--spacer-xl) 0;
    --carousel-padding: var(--spacer-xl);
    --carousel-max-width: calc(100% - 13.5rem);
  }
}
.product-card {
  &:hover {
    --product-card-box-shadow: 0 4px 20px rgba(168, 172, 176, 0.19);
  }
}
.images-grid {
  max-width: 60rem;
  margin: 0 auto;
  &__row {
    display: flex;
    & + & {
      margin: calc(var(--spacer-xl) / 2) 0 0 0;
      @include for-desktop {
        margin: var(--spacer-xl) 0 0 0;
      }
    }
  }
  &__col {
    flex: 1;
    margin: 0;
    & + & {
      margin: 0 0 0 calc(var(--spacer-xl) / 2);
      @include for-desktop {
        margin: 0 0 0 var(--spacer-xl);
      }
    }
  }
}
.banner-app {
  --banner-title-margin: var(--spacer-xl) 0 0 0;
  --banner-title-font-size: var(--h1-font-size);
  --banner-subtitle-font-size: var(--font-size-extra-big);
  min-height: 26.25rem;
  max-width: 65rem;
  margin: 0 auto;
  padding-right: calc(25% + 5rem);
  padding-left: 2.5rem;
  &__call-to-action {
    display: flex;
    margin: var(--space-big) 0 0 0;
  }
  &__image {
    width: 22%;
    & + & {
      margin: 0 0 0 var(--spacer-xl);
    }
  }
}
</style>
