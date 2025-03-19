import supabase from "@/lib/client/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useOrdersSubscription = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const channels = supabase.channel('custom-all-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      }
    )
    .subscribe()
    return () => {
      channels.unsubscribe();
    };
  }, []);
}

export const useUpdateOrderSubscription = (id: number) => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const orders = supabase
      .channel('custom-filter-channel')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['orders', id] });
        }
      )
      .subscribe();
  
    return () => {
      orders.unsubscribe();
    };
  }, [id]);
}