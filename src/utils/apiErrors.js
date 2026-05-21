export const getApiErrorMessage = (error, fallback = 'Something went wrong.') => {
  const status = error?.response?.status;
  const data = error?.response?.data;

  if (status === 429) {
    return data?.message || 'Too many attempts. Please try again later.';
  }

  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors.map((item) => item.message).join(' ');
  }

  return data?.message || data?.msg || fallback;
};

export const getFieldErrors = (error) => {
  const errors = error?.response?.data?.errors;

  if (!Array.isArray(errors)) {
    return {};
  }

  return errors.reduce((acc, item) => {
    if (item.field && !acc[item.field]) {
      acc[item.field] = item.message;
    }

    return acc;
  }, {});
};

export const buildFetchError = (response, data) => ({
  response: {
    status: response.status,
    data
  }
});
