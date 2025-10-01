// client side http request

// multipart/form-data upload file

const postFormRequest = async (url: string, data: any, token?: string, options?: RequestInit) => {
  const { headers, ...otherOptions } = options || {};
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/api${url}`, {
      method: 'POST',
      body: data,
      ...otherOptions,
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    });

    const resData = await response.json();
    if (response.ok) {
      return resData;
    }

    throw new Error(resData?.message || response.statusText);
  } catch (error: any) {
    return {
      code: 500,
      message: error?.message,
    };
  }
};

export const clientHttpClient = {
  postForm: postFormRequest,
};
