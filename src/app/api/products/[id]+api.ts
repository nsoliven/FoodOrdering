import supabase from "@lib/supabaseServer";
import { requireAdmin } from "@lib/authUtilsServer";

// Get a single product by ID
export async function GET(request: Request) {
  try {
    // Extract ID from URL pathname
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split('/').pop() || '0');
    
    console.log('Fetching product with ID:', id);
    console.log('Request URL:', request.url);
    
    // No authentication required for viewing a product
    const {data, error} = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if(error) {
      console.error('Error fetching product:', error.message);
      return Response.json({ error: error.message }, { status: 400 });
    }
    
    if(!data) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    
    return Response.json(data);
  } catch (error: any) {
    console.error('Unexpected error in GET handler:', error.message);
    return Response.json({ 
      error: "Server error while fetching product", 
      details: error.message 
    }, { status: 500 });
  }
}

// Update a product
export async function PUT(request: Request) {
  try {
    // Check if user is admin
    const { authorized, error: authError } = await requireAdmin(request);

    console.log('Updating product');
    console.log('Request URL:', request.url);
    
    if (!authorized) {
      return Response.json({ 
        error: authError || "Unauthorized" 
      }, { status: 401 });
    }
    
    // Extract ID from URL pathname
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split('/').pop() || '0');
    
    console.log('Updating product with ID:', id);
    console.log('Request URL:', request.url);
    
    let body;
    try {
      body = await request.json();
    } catch (parseError: any) {
      console.error('Error parsing request body:', parseError.message);
      return Response.json({ 
        error: "Invalid JSON in request body", 
        details: parseError.message 
      }, { status: 400 });
    }
    
    // Validate required fields
    if (!body.name || body.price === undefined) {
      return Response.json({ error: "Name and price are required" }, { status: 400 });
    }
    
    const { error, data: updatedProduct } = await supabase
      .from('products')
      .update({
        name: body.name,
        image: body.image,
        price: body.price,
      })
      .eq('id', id)
      .select()
      .maybeSingle();

    if(error) {
      console.error('Error updating product:', error.message);
      return Response.json({ error: error.message }, { status: 400 });
    }
    
    if(!updatedProduct) {
      return Response.json({ error: "Product not found or not updated" }, { status: 404 });
    }
    
    return Response.json(updatedProduct);
  } catch (error: any) {
    console.error('Unexpected error in PUT handler:', error.message);
    return Response.json({ 
      error: "Server error while updating product", 
      details: error.message 
    }, { status: 500 });
  }
}

// Delete a product
export async function DELETE(request: Request) {
  try {
    // Check if user is admin
    const { authorized, error: authError } = await requireAdmin(request);
    
    if (!authorized) {
      return Response.json({ 
        error: authError || "Unauthorized" 
      }, { status: 401 });
    }
    
    // Extract ID from URL pathname
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split('/').pop() || '0');
    
    console.log('Deleting product with ID:', id);
    console.log('Request URL:', request.url);
    
    // First check if the product exists
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('id')
      .eq('id', id)
      .maybeSingle();
      
    if(fetchError) {
      console.error('Error checking product existence:', fetchError.message);
      return Response.json({ error: fetchError.message }, { status: 400 });
    }
    
    if(!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    
    // Proceed with deletion
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if(error) {
      console.error('Error deleting product:', error.message);
      return Response.json({ error: error.message }, { status: 400 });
    }
    
    return Response.json({ 
      success: true, 
      message: `Product with ID ${id} deleted successfully` 
    });
  } catch (error: any) {
    console.error('Unexpected error in DELETE handler:', error.message);
    return Response.json({ 
      error: "Server error while deleting product", 
      details: error.message 
    }, { status: 500 });
  }
}
