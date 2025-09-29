export const apiMiddleware =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    const BASE_URL = "https://dummyjson.com";

    if (action.type === "api/makeCall") {
      next(action);

      const payloads = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      for (let payload of payloads) {
        const { url, onSuccess, onStart, onError } = payload;

        if (onStart) dispatch({ type: onStart });

        try {
          const res = await fetch(`${BASE_URL}/${url}`);
          const data = await res.json();

          if (onSuccess) {
            dispatch({ type: onSuccess, payload: data.products || data });
          }
        } catch (error) {
          if (onError) dispatch({ type: onError, payload: error.message });
        }
      }
    } else {
      return next(action);
    }
  };

export const fetchData = (payload) => ({ type: "api/makeCall", payload });
