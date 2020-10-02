
export function getFooterLink(routeDetail: any) {
  if (routeDetail.type === 'page') {
    return `/pages/${routeDetail.slug}`;
  } else if (routeDetail.type === 'collection') {
    return `/c/${routeDetail.slug}`;
  } else if (routeDetail.type === 'social') {
    return routeDetail.slug;
  }
  return '/';
}
