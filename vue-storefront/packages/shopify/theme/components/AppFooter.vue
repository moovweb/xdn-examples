<template>
  <SfFooter :column="4" multiple id="footer">
    <SfFooterColumn :title="$t('About us')">
      <SfList>
        <SfListItem
          v-for="item in aboutUs"
          :key="item"
          >
          <SfMenuItem
            :data-cy="`app-foter-url_about-us_${item.title.split(' ').join('-').toLowerCase()}`"
            :label="$t(item.title)"
          >
            <template #label>
              <nuxt-link :to="localePath(getFooterLink(item))">
                {{ $t(item.title) }}
              </nuxt-link>
            </template>
          </SfMenuItem>
        </SfListItem>
      </SfList>
    </SfFooterColumn>
    <SfFooterColumn :title="$t('Departments')">
      <SfList>
        <SfListItem
          v-for="item in departments"
          :key="item"
          >
          <SfMenuItem
            :data-cy="`app-foter-url_departments_${item.title.split(' ').join('-').toLowerCase()}`"
            :label="$t(item.title)"
          >
            <template #label>
              <nuxt-link :to="localePath(getFooterLink(item))">
                {{ $t(item.title) }}
              </nuxt-link>
            </template>
          </SfMenuItem>
        </SfListItem>
      </SfList>
    </SfFooterColumn>
    <SfFooterColumn :title="$t('Help')">
      <SfList>
        <SfListItem
          v-for="item in help"
          :key="item"
          >
          <SfMenuItem
            :data-cy="`app-foter-url_help_${item.title.split(' ').join('-').toLowerCase()}`"
            :label="$t(item.title)"
          >
            <template #label>
              <nuxt-link :to="localePath(getFooterLink(item))">
                {{ $t(item.title) }}
              </nuxt-link>
            </template>
          </SfMenuItem>
        </SfListItem>
      </SfList>
    </SfFooterColumn>
    <SfFooterColumn :title="$t('Payment & Delivery')">
      <SfList>
        <SfListItem
          v-for="item in paymentsDelivery"
          :key="item"
          >
          <SfMenuItem
            :data-cy="`app-foter-url_help_${item.title.split(' ').join('-').toLowerCase()}`"
            :label="$t(item.title)"
          >
            <template #label>
              <nuxt-link :to="localePath(getFooterLink(item))">
                {{ $t(item.title) }}
              </nuxt-link>
            </template>
          </SfMenuItem>
        </SfListItem>
      </SfList>
    </SfFooterColumn>
    <SfFooterColumn title="Social">
      <div class="footer__socials">
        <a target="__blank" :href="getFooterLink(item)" v-for="item in social" :key="item.title" >
          <SfImage class="footer__social-image" :alt="item.title" :src="'/icons/'+item.icon+'.svg'" width="12" height="12" />
        </a>
      </div>
    </SfFooterColumn>
  </SfFooter>
</template>

<script>
import { getFooterLink } from '~/helpers/app';
import { SfFooter, SfList, SfImage, SfMenuItem } from '@storefront-ui/vue';

export default {
  components: {
    SfFooter,
    SfList,
    SfImage,
    SfMenuItem
  },
  setup() {
    return {
      getFooterLink
    };
  },
  data() {
    return {
      aboutUs: [
        {
          slug: 'who-we-are',
          type: 'page',
          title: 'Who we are'
        },
        {
          slug: 'quality-in-the-details',
          type: 'page',
          title: 'Quality in the details'
        },
        {
          slug: 'customer-reviews',
          type: 'page',
          title: 'Customer Reviews'
        }
      ],
      departments: [
        {
          slug: 'clothes',
          type: 'collection',
          title: 'Clothes'
        },
        {
          slug: 'event-dressing',
          type: 'collection',
          title: 'Event Dressing'
        },
        {
          slug: 'accessories',
          type: 'collection',
          title: 'Accessories'
        },
        {
          slug: 'outlet',
          type: 'collection',
          title: 'Outlet'
        }
      ],
      help: [
        {
          slug: 'customer-service',
          type: 'page',
          title: 'Customer service'
        },
        {
          slug: 'size-guide',
          type: 'page',
          title: 'Size guide'
        },
        {
          slug: 'contact-us',
          type: 'page',
          title: 'Contact us'
        }
      ],
      paymentsDelivery: [
        {
          slug: 'purchase-terms',
          type: 'page',
          title: 'Purchase terms'
        },
        {
          slug: 'guarantee',
          type: 'page',
          title: 'Guarantee'
        }
      ],
      social: [
        {
          slug: 'https://twitter.com/aureate_labs',
          type: 'social',
          title: 'Twitter',
          icon: 'twitter'
        },
        {
          slug: 'https://www.facebook.com/aureate.labs',
          type: 'social',
          title: 'Facebook',
          icon: 'facebook'
        },
        {
          slug: 'https://www.instagram.com/aureate_labs',
          type: 'social',
          title: 'Instagram',
          icon: 'instagram'
        },
        {
          slug: 'https://www.youtube.com/channel/UC-gHzpwI_CrXplSquIPjppQ',
          type: 'social',
          title: 'Youtube',
          icon: 'youtube'
        }
      ],
      isMobile: false,
      desktopMin: 1024
    };
  }
};
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/variables";

@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}

.footer {
  &__socials {
    padding: var(--spacer-base) var(--spacer-xl);

    @media screen and (min-width: $desktop-min) {
      padding: var(--spacer-sm) 0;
    }
  }
  &__social-image {
    margin: 0 var(--spacer-base) 0 0;
  }
}
</style>
