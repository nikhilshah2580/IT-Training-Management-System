import api from "./apiClient";

/*
|--------------------------------------------------------------------------
| GET ALL JOB PLACEMENTS
|--------------------------------------------------------------------------
*/

export const getJobPlacements = async (params = {}) => {
    const response = await api.get("/job-placements", {
        params,
    });

    return response.data;
};

/*
|--------------------------------------------------------------------------
| GET SINGLE JOB PLACEMENT
|--------------------------------------------------------------------------
*/

export const getJobPlacement = async (id) => {
    const response = await api.get(`/job-placements/${id}`);

    return response.data;
};

/*
|--------------------------------------------------------------------------
| CREATE JOB PLACEMENT
| ADMIN
|--------------------------------------------------------------------------
*/

export const createJobPlacement = async (data) => {
    const response = await api.post("/job-placements", data);

    return response.data;
};

/*
|--------------------------------------------------------------------------
| UPDATE JOB PLACEMENT
| ADMIN
|--------------------------------------------------------------------------
*/

export const updateJobPlacement = async (id, data) => {
    const response = await api.put(`/job-placements/${id}`, data);

    return response.data;
};

/*
|--------------------------------------------------------------------------
| DELETE JOB PLACEMENT
| ADMIN
|--------------------------------------------------------------------------
*/

export const deleteJobPlacement = async (id) => {
    const response = await api.delete(`/job-placements/${id}`);

    return response.data;
};

/*
|--------------------------------------------------------------------------
| UPDATE JOB PLACEMENT STATUS
| ADMIN
|--------------------------------------------------------------------------
*/

export const updateJobPlacementStatus = async (id, status) => {
    const response = await api.patch(`/job-placements/${id}/status`, {
        status,
    });

    return response.data;
};
