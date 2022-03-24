export const VALUE = 'value';
export const ERROR = 'error';
export const REQUIRED_FIELD_ERROR = "Field can't be empty";

function is_bool(value) {
  return typeof value === 'boolean';
}

/**
 * Determines a value if it's an object
 *
 * @param {object} value
 */
export function is_object(value) {
  return typeof value === 'object' && value !== null;
}

/**
 *
 * @param {string} value
 * @param {boolean} isRequired
 */
export function is_required(value, isRequired) {
  if (!value && isRequired) return REQUIRED_FIELD_ERROR;
  return '';
}

export function get_prop_values(stateSchema, prop) {
  return Object.keys(stateSchema).reduce((field, key) => {
    field[key] = is_bool(prop) ? prop : stateSchema[key][prop];
    return field;
  }, {});
}


function isObject(object) {
  return object != null && typeof object === 'object';
}

export function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      areObjects && !deepEqual(val1, val2) ||
      !areObjects && val1 !== val2
    ) {
      return false;
    }
  }

  return true;
}