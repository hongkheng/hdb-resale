export function serialize (str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\W+/g, '-');
}

export function capitalizeFirstLetters (phrase) {
  return phrase
    .toLowerCase()
    .replace('/', ' / ')
    .split(' ')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

export function getMonthYear (dateStr) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[+dateStr.slice(5, 7) - 1] + ' ' + dateStr.slice(0, 4);
}

export const googleMapsStyles = {
  blueWater: [{
    'featureType': 'administrative',
    'elementType': 'labels.text.fill',
    'stylers': [{
      'color': '#444444'
    }]
  }, {
    'featureType': 'landscape',
    'elementType': 'all',
    'stylers': [{
      'color': '#f2f2f2'
    }]
  }, {
    'featureType': 'poi',
    'elementType': 'all',
    'stylers': [{
      'visibility': 'off'
    }]
  }, {
    'featureType': 'road',
    'elementType': 'all',
    'stylers': [{
      'saturation': -100
    }, {
      'lightness': 45
    }]
  }, {
    'featureType': 'road.highway',
    'elementType': 'all',
    'stylers': [{
      'visibility': 'simplified'
    }]
  }, {
    'featureType': 'road.arterial',
    'elementType': 'labels.icon',
    'stylers': [{
      'visibility': 'off'
    }]
  }, {
    'featureType': 'transit',
    'elementType': 'all',
    'stylers': [{
      'visibility': 'off'
    }]
  }, {
    'featureType': 'water',
    'elementType': 'all',
    'stylers': [{
      'color': '#46bcec'
    }, {
      'visibility': 'on'
    }]
  }]
};
