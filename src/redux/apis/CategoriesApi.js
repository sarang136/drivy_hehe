// src/redux/api/bookingApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const CategoriesApi = createApi({
  reducerPath: 'Categories',
  baseQuery: fetchBaseQuery({
    baseUrl: `https://drvvy-backend-s21a.onrender.com`,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => '/driver-getAllCategoryNames',
    }),

    addCategory: builder.mutation({
      query: (body) => ({
        url: `/driver-categories`,
        method: 'POST',
        body,
       
      }),
    }),
    getAllSubCategories: builder.mutation({
      query: (categoryName) => ({
        url: '/driver-categories/getSubcategoriesByCategory',
        method: 'POST',
        body: {
          name: categoryName,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    addSubCategory: builder.mutation({
      query: ({ categoryId, formData }) => ({
        url: `/driver-categories/subcategory/${categoryId}`,
        method: 'POST',
        body: formData,

      }),
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `driver-categories/${categoryId}`,
        method: 'DELETE',
      }),
    }),

    deleteSubCategory: builder.mutation({
      query: (subCategoryId) => ({
        url: `subcategory/${subCategoryId}`,
        method: 'DELETE',
      }),
    }),

    updateSubCategory: builder.mutation({
      query: ({ subCategoryId, formData }) => ({
        url: `/subcategory/${subCategoryId}`,
        method: 'PUT',
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetAllSubCategoriesMutation,
  useAddSubCategoryMutation,
  useDeleteCategoryMutation,
  useDeleteSubCategoryMutation,
  useAddCategoryMutation,
  useUpdateSubCategoryMutation
} = CategoriesApi;
