import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "@lib/supabase";

// Base URL for your API
const API_URL = "http://localhost:8081/api";

// Helper to get authentication header
const getAuthHeader = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token 
    ? { Authorization: `Bearer ${data.session.access_token}` }
    : {};
};

export const useProductList = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/products`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch products");
      }
      
      return response.json();
    } 
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/products/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch product ${id}`);
      }
      
      return response.json();
    },
    enabled: !!id // Only run the query if id is provided
  });
};

export const useInsertProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const authHeader = await getAuthHeader();
      
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify({
          name: data.name,
          image: data.image,
          price: data.price,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create product");
      }
      
      return response.json();
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError(error) {
      console.error('Error creating product:', error);
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const authHeader = await getAuthHeader();
      
      const response = await fetch(`${API_URL}/products/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify({
          name: data.name,
          image: data.image,
          price: data.price,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update product");
      }
      
      return response.json();
    },
    async onSuccess(data) {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['products', data.id] });
    },
    onError(error) {
      console.error('Error updating product:', error);
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const authHeader = await getAuthHeader();
      
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          ...authHeader
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete product");
      }
      
      return response.json();
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError(error) {
      console.error('Error deleting product:', error);
    }
  });
};
