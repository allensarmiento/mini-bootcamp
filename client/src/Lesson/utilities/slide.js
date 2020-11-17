export function getSlideValue(type) {
  let value = '';

  if (type === 'text') {
    value = 'text';
  } else if (type === 'question') {
    value = 'text';
  } else if (type === 'image') {
    value = 'image';
  } else if (type === 'table') {
    value = 'table';
  }

  return value;
}

export function empty() {}
