import supabase from "@lib/client/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InsertTables } from "@src/types";

export const useInsertOrderItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: InsertTables<'order_items'>[]) => {
      const { error, data: newOrderItems } =  await supabase
        .from('order_items')
        .insert(items)
        .select();
      if(error) throw new Error(error.message);
      return newOrderItems;
    },
    onError(error) {
      console.error('Error creating order:', error);
    }
  })
}