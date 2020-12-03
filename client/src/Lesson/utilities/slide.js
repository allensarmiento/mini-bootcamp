export function getSlideValue(type) {
  let value = '';

  if (type === 'text') {
    value = 'text';
  } else if (type === 'question') {
    value = 'text';
  } else if (type === 'link') {
    value = 'link';
  } else if (type === 'image') {
    value = 'image';
  } else if (type === 'table') {
    value = 'table';
  } else if (type === 'unordered-list') {
    value = 'unordered-list';
  } else if (type === 'ordered-list') {
    value = 'ordered-list';
  } else if (type === 'code') {
    value = 'code';
  }

  return value;
}

export function empty() {}
