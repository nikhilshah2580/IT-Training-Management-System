import api from "./apiClient";

/*
|--------------------------------------------------------------------------
| GET MY NOTIFICATIONS
|--------------------------------------------------------------------------
| GET /notifications
|--------------------------------------------------------------------------
*/

export const getMyNotifications = async (params = {}) => {
  const response = await api.get("/notifications", {
    params,
  });

  return response.data;
};

/*
|--------------------------------------------------------------------------
| GET SINGLE NOTIFICATION
|--------------------------------------------------------------------------
| GET /notifications/:id
|--------------------------------------------------------------------------
*/

export const getNotification = async (id) => {
  const response = await api.get(`/notifications/${id}`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| MARK ONE NOTIFICATION AS READ
|--------------------------------------------------------------------------
| PATCH /notifications/:id/read
|--------------------------------------------------------------------------
*/

export const markNotificationAsRead = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| MARK ALL NOTIFICATIONS AS READ
|--------------------------------------------------------------------------
| PATCH /notifications/read-all
|--------------------------------------------------------------------------
*/

export const markAllNotificationsAsRead = async () => {
  const response = await api.patch("/notifications/read-all");

  return response.data;
};

/*
|--------------------------------------------------------------------------
| DELETE ONE NOTIFICATION
|--------------------------------------------------------------------------
| DELETE /notifications/:id
|--------------------------------------------------------------------------
*/

export const deleteNotification = async (id) => {
  const response = await api.delete(`/notifications/${id}`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| DELETE ALL MY NOTIFICATIONS
|--------------------------------------------------------------------------
| DELETE /notifications
|--------------------------------------------------------------------------
*/

export const deleteAllNotifications = async () => {
  const response = await api.delete("/notifications");

  return response.data;
};

/*
|--------------------------------------------------------------------------
| ADMIN CREATE NOTIFICATION
|--------------------------------------------------------------------------
| POST /notifications/admin/create
|--------------------------------------------------------------------------
*/

export const createAdminNotification = async (data) => {
  const response = await api.post("/notifications/admin/create", data);

  return response.data;
};
