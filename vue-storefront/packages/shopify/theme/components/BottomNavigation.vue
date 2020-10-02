<template>
<!-- TODO: create logic with isActive prop for BottomNavigationItems -->
  <SfBottomNavigation class="mobile-only bottom-menu-mobile">
    <nuxt-link data-cy="bottom-navigation-url_home" to="/">
      <SfBottomNavigationItem :class="$route.path == '/' ? 'sf-bottom-navigation__item--active' : ''" icon="home" size="20px" label="Home"/>
    </nuxt-link>
    <SfBottomNavigationItem
      icon="menu"
      data-cy="bottom-navigation-url_menu"
      icon-size="20px"
      label="Menu"
      class="menu-button arrow-hide"
    >
      <template #icon>
        <SfIcon icon="menu" size="20px" style="width: 25px;" />
        <SfSelect class="menu-button__select">
          <SfSelectOption
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            <nuxt-link :to="'/c/' + category.handle">
              {{ category.title }}
            </nuxt-link>
          </SfSelectOption>
        </SfSelect>
      </template>
    </SfBottomNavigationItem>
    <SfBottomNavigationItem
      icon="profile"
      data-cy="bottom-navigation-url_account"
      label="Account"
      class="menu-button arrow-hide"
    >
      <template #icon>
        <SfIcon icon="profile" size="20px" @click="onAccountClicked" />
        <SfSelect v-if="isLoggedIn" class="menu-button__select">
          <!-- TODO: change .native to @click after https://github.com/DivanteLtd/storefront-ui/issues/1097 -->
          <SfSelectOption
            :value="'my-account'"
            @click.native="onAccountClicked"
          >
            My account
          </SfSelectOption>
          <!-- TODO: change .native to @click after https://github.com/DivanteLtd/storefront-ui/issues/1097 -->
          <SfSelectOption
            :value="'logout'"
            @click.native="logout"
          >
            Logout
          </SfSelectOption>
        </SfSelect>
      </template>
    </SfBottomNavigationItem>
    <SfBottomNavigationItem
      :icon="cartIcon"
      label="Cart"
      :is-floating="true"
    >
      <template #icon>
        <SfCircleIcon
          aria-label="Go to Cart"
          :icon="cartIcon"
          :has-badge="cartTotalItems > 0"
          :badge-label="cartTotalItems"
          @click="toggleCartSidebar"
        />
      </template>
    </SfBottomNavigationItem>
  </SfBottomNavigation>
</template>

<script>
import { SfBottomNavigation, SfIcon, SfCircleIcon, SfButton, SfSelect } from '@storefront-ui/vue';
import uiState from '~/assets/ui-state';
import {
  useCart,
  useUser,
  useCategory,
  cartGetters
} from '@vue-storefront/shopify';
import { computed } from '@vue/composition-api';
import { onSSR } from '@vue-storefront/core';
const { toggleCartSidebar, toggleLoginModal } = uiState;

export default {
  components: {
    SfBottomNavigation,
    SfIcon,
    SfButton,
    SfSelect,
    SfCircleIcon
  },
  setup(props, context) {
    const { isAuthenticated, logout } = useUser();
    const { cart, loadCart } = useCart();
    const { categories, search } = useCategory('categories');
    const cartTotalItems = computed(() => {
      const count = cartGetters.getTotalItems(cart.value);
      return count ? count.toString() : null;
    });

    const accountIcon = computed(() =>
      isAuthenticated.value ? 'profile_fill' : 'profile'
    );

    const isLoggedIn = computed(() =>
      isAuthenticated.value ? isAuthenticated.value : false
    );

    const cartIcon = computed(() => {
      const count = cartGetters.getTotalItems(cart.value);
      if (count) return 'add_to_cart';
      return 'empty_cart';
    });

    const onAccountClicked = () => {
      isAuthenticated && isAuthenticated.value
        ? context.root.$router.push('/my-account')
        : toggleLoginModal();
    };

    onSSR(async () => {
      await search({ slug: '' });
      await loadCart();
    });

    return {
      accountIcon,
      logout,
      cartIcon,
      categories,
      isLoggedIn,
      cartTotalItems,
      toggleLoginModal,
      onAccountClicked,
      toggleCartSidebar
    };
  }
};
</script>
<style lang="scss">
.bottom-menu-mobile {
  .arrow-hide {
    .sf-select {
      padding: 0;
      position: absolute;
      .sf-select__chevron {
        display: none !important;
      }
    }
  }

}
</style>
