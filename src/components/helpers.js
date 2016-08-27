export function serialize(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\W+/g, '-');
}

export function capitalizeFirstLetters(phrase) {
  return phrase
    .toLowerCase()
    .replace('/', ' / ')
    .split(' ')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

export function getMonthYear(dateStr) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[+dateStr.slice(5, 7) - 1] + ' ' + dateStr.slice(0, 4);
}

export const googleMapsStyles = {
  ultraLight: [{
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [{
      'color': '#e9e9e9'
    }, {
      'lightness': 17
    }]
  }, {
    'featureType': 'landscape',
    'elementType': 'geometry',
    'stylers': [{
      'color': '#f5f5f5'
    }, {
      'lightness': 20
    }]
  }, {
    'featureType': 'road.highway',
    'elementType': 'geometry.fill',
    'stylers': [{
      'color': '#ffffff'
    }, {
      'lightness': 17
    }]
  }, {
    'featureType': 'road.highway',
    'elementType': 'geometry.stroke',
    'stylers': [{
      'color': '#ffffff'
    }, {
      'lightness': 29
    }, {
      'weight': 0.2
    }]
  }, {
    'featureType': 'road.arterial',
    'elementType': 'geometry',
    'stylers': [{
      'color': '#ffffff'
    }, {
      'lightness': 18
    }]
  }, {
    'featureType': 'road.local',
    'elementType': 'geometry',
    'stylers': [{
      'color': '#ffffff'
    }, {
      'lightness': 16
    }]
  }, {
    'featureType': 'poi',
    'elementType': 'geometry',
    'stylers': [{
      'color': '#f5f5f5'
    }, {
      'lightness': 21
    }]
  }, {
    'featureType': 'poi.park',
    'elementType': 'geometry',
    'stylers': [{
      'color': '#dedede'
    }, {
      'lightness': 21
    }]
  }, {
    'elementType': 'labels.text.stroke',
    'stylers': [{
      'visibility': 'on'
    }, {
      'color': '#ffffff'
    }, {
      'lightness': 16
    }]
  }, {
    'elementType': 'labels.text.fill',
    'stylers': [{
      'saturation': 36
    }, {
      'color': '#333333'
    }, {
      'lightness': 40
    }]
  }, {
    'elementType': 'labels.icon',
    'stylers': [{
      'visibility': 'off'
    }]
  }, {
    'featureType': 'transit',
    'elementType': 'geometry',
    'stylers': [{
      'color': '#f2f2f2'
    }, {
      'lightness': 19
    }]
  }, {
    'featureType': 'administrative',
    'elementType': 'geometry.fill',
    'stylers': [{
      'color': '#fefefe'
    }, {
      'lightness': 20
    }]
  }, {
    'featureType': 'administrative',
    'elementType': 'geometry.stroke',
    'stylers': [{
      'color': '#fefefe'
    }, {
      'lightness': 17
    }, {
      'weight': 1.2
    }]
  }],
  lightDream: [{
    'featureType': 'landscape',
    'stylers': [{
      'hue': '#FFBB00'
    }, {
      'saturation': 43.400000000000006
    }, {
      'lightness': 37.599999999999994
    }, {
      'gamma': 1
    }]
  }, {
    'featureType': 'road.highway',
    'stylers': [{
      'hue': '#FFC200'
    }, {
      'saturation': -61.8
    }, {
      'lightness': 45.599999999999994
    }, {
      'gamma': 1
    }]
  }, {
    'featureType': 'road.arterial',
    'stylers': [{
      'hue': '#FF0300'
    }, {
      'saturation': -100
    }, {
      'lightness': 51.19999999999999
    }, {
      'gamma': 1
    }]
  }, {
    'featureType': 'road.local',
    'stylers': [{
      'hue': '#FF0300'
    }, {
      'saturation': -100
    }, {
      'lightness': 52
    }, {
      'gamma': 1
    }]
  }, {
    'featureType': 'water',
    'stylers': [{
      'hue': '#0078FF'
    }, {
      'saturation': -13.200000000000003
    }, {
      'lightness': 2.4000000000000057
    }, {
      'gamma': 1
    }]
  }, {
    'featureType': 'poi',
    'stylers': [{
      'hue': '#00FF6A'
    }, {
      'saturation': -1.0989010989011234
    }, {
      'lightness': 11.200000000000017
    }, {
      'gamma': 1
    }]
  }],
  blueEssence: [{
    'featureType': 'landscape.natural',
    'elementType': 'geometry.fill',
    'stylers': [{
      'visibility': 'on'
    }, {
      'color': '#e0efef'
    }]
  }, {
    'featureType': 'poi',
    'elementType': 'geometry.fill',
    'stylers': [{
      'visibility': 'on'
    }, {
      'hue': '#1900ff'
    }, {
      'color': '#c0e8e8'
    }]
  }, {
    'featureType': 'road',
    'elementType': 'geometry',
    'stylers': [{
      'lightness': 100
    }, {
      'visibility': 'simplified'
    }]
  }, {
    'featureType': 'road',
    'elementType': 'labels',
    'stylers': [{
      'visibility': 'off'
    }]
  }, {
    'featureType': 'transit.line',
    'elementType': 'geometry',
    'stylers': [{
      'visibility': 'on'
    }, {
      'lightness': 700
    }]
  }, {
    'featureType': 'water',
    'elementType': 'all',
    'stylers': [{
      'color': '#7dcdcd'
    }]
  }],
  paper: [{
    'featureType': 'administrative',
    'elementType': 'all',
    'stylers': [{
      'visibility': 'off'
    }]
  }, {
    'featureType': 'landscape',
    'elementType': 'all',
    'stylers': [{
      'visibility': 'simplified'
    }, {
      'hue': '#0066ff'
    }, {
      'saturation': 74
    }, {
      'lightness': 100
    }]
  }, {
    'featureType': 'poi',
    'elementType': 'all',
    'stylers': [{
      'visibility': 'simplified'
    }]
  }, {
    'featureType': 'road',
    'elementType': 'all',
    'stylers': [{
      'visibility': 'simplified'
    }]
  }, {
    'featureType': 'road.highway',
    'elementType': 'all',
    'stylers': [{
      'visibility': 'off'
    }, {
      'weight': 0.6
    }, {
      'saturation': -85
    }, {
      'lightness': 61
    }]
  }, {
    'featureType': 'road.highway',
    'elementType': 'geometry',
    'stylers': [{
      'visibility': 'on'
    }]
  }, {
    'featureType': 'road.arterial',
    'elementType': 'all',
    'stylers': [{
      'visibility': 'off'
    }]
  }, {
    'featureType': 'road.local',
    'elementType': 'all',
    'stylers': [{
      'visibility': 'on'
    }]
  }, {
    'featureType': 'transit',
    'elementType': 'all',
    'stylers': [{
      'visibility': 'simplified'
    }]
  }, {
    'featureType': 'water',
    'elementType': 'all',
    'stylers': [{
      'visibility': 'simplified'
    }, {
      'color': '#5f94ff'
    }, {
      'lightness': 26
    }, {
      'gamma': 5.86
    }]
  }],
  subtleGreyscale: [{
    'featureType': 'landscape',
    'stylers': [{
      'saturation': -100
    }, {
      'lightness': 65
    }, {
      'visibility': 'on'
    }]
  }, {
    'featureType': 'poi',
    'stylers': [{
      'saturation': -100
    }, {
      'lightness': 51
    }, {
      'visibility': 'simplified'
    }]
  }, {
    'featureType': 'road.highway',
    'stylers': [{
      'saturation': -100
    }, {
      'visibility': 'simplified'
    }]
  }, {
    'featureType': 'road.arterial',
    'stylers': [{
      'saturation': -100
    }, {
      'lightness': 30
    }, {
      'visibility': 'on'
    }]
  }, {
    'featureType': 'road.local',
    'stylers': [{
      'saturation': -100
    }, {
      'lightness': 40
    }, {
      'visibility': 'on'
    }]
  }, {
    'featureType': 'transit',
    'stylers': [{
      'saturation': -100
    }, {
      'visibility': 'simplified'
    }]
  }, {
    'featureType': 'administrative.province',
    'stylers': [{
      'visibility': 'off'
    }]
  }, {
    'featureType': 'water',
    'elementType': 'labels',
    'stylers': [{
      'visibility': 'on'
    }, {
      'lightness': -25
    }, {
      'saturation': -100
    }]
  }, {
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [{
      'hue': '#ffff00'
    }, {
      'lightness': -25
    }, {
      'saturation': -97
    }]
  }],
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
