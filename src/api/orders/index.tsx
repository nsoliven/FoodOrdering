import supabase from "@lib/supabase";
import { useAuth } from "@src/providers/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InsertTables, UpdateTables } from "@src/types";

export const useAdminOrderList = ({ archived = false }) => {
  const Statuses = archived ? ['Delivered'] : ['New', 'Cooking', 'Delivering'];

  return useQuery({
    queryKey: ['orders', { archived }],
    queryFn: async () => {
      const {data, error} = await supabase
        .from('orders')
        .select('*')
        .in('status', Statuses)
        .order('created_at', { ascending: false });
      if(error) throw new Error(error.message);
      return data;
    } 
  })
}

export const useMyOrderList = () => {
  const { session } = useAuth();
  const id = session?.user.id;

  return useQuery({
    queryKey: ['orders', { userId: id }],
    queryFn: async () => {
      if(!id) return null;

      const {data, error} = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });
      if(error) throw new Error(error.message);
      return data;
    } 
  })
}
export const useOrderDetails = (id: number) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const {data, error} = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('id', id)
        .single();
      if(error) throw new Error(error.message);
      return data;
    } 
  })
}

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const {data, error} = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if(error) throw new Error(error.message);
      return data;
    } 
  })
}

export const useInsertOrder = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id;
  return useMutation({
    mutationFn: async (data: UpdateTables<'orders'>) => {
      if (!userId) throw new Error('User not authenticated');
      const { error, data: newOrder } =  await supabase
        .from('orders')
        .insert({...data, user_id: userId})
        .select()
        .single();

      if(error) throw new Error(error.message);
      return newOrder;
    },
    async onSuccess(data) {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError(error) {
      console.error('Error creating order:', error);
    }
  })
}

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      updatedFields,
    }: {
      id: number;
      updatedFields: UpdateTables<'orders'>;
    }) => {
      const { error, data: updatedOrder } =  await supabase
        .from('orders')
        .update(updatedFields)
        .eq('id', id)
        .select()
        .single();

      if(error) throw new Error(error.message);
      return updatedOrder;
    },
    async onSuccess({ id }) {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      await queryClient.invalidateQueries({ queryKey: ['orders', id] });
    },
    onError(error) {
      console.error('Error updating Order:', error);
    }
  })
}