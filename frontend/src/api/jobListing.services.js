import api from "./apiClient";

/*
|--------------------------------------------------------------------------
| GET ALL JOB LISTINGS
|--------------------------------------------------------------------------
*/

export const getJobListings = async (params = {}) => {
    const response = await api.get("/job-listings", {
        params,
    });

    return response.data;
};

/*
|--------------------------------------------------------------------------
| GET SINGLE JOB LISTING
|--------------------------------------------------------------------------
*/

export const getJobListing = async (id) => {
    const response = await api.get(`/job-listings/${id}`);

    return response.data;
};

/*
|--------------------------------------------------------------------------
| CREATE JOB LISTING
| ADMIN
|--------------------------------------------------------------------------
*/

export const createJobListing = async (data) => {
    const response = await api.post("/job-listings", data);

    return response.data;
};

/*
|--------------------------------------------------------------------------
| UPDATE JOB LISTING
| ADMIN
|--------------------------------------------------------------------------
*/

export const updateJobListing = async (id, data) => {
    const response = await api.put(`/job-listings/${id}`, data);

    return response.data;
};

/*
|--------------------------------------------------------------------------
| DELETE JOB LISTING
| ADMIN
|--------------------------------------------------------------------------
*/

export const deleteJobListing = async (id) => {
    const response = await api.delete(`/job-listings/${id}`);

    return response.data;
};

/*
|--------------------------------------------------------------------------
| UPDATE JOB LISTING STATUS
| ADMIN
|--------------------------------------------------------------------------
*/

export const updateJobListingStatus = async (id, status) => {
    const response = await api.patch(`/job-listings/${id}/status`, {
        status,
    });

    return response.data;
};
