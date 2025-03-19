import supabase from "@lib/supabaseServer";

// Get all products
export async function GET(request: Request) {
  try {
    console.log('Fetching all products');
    console.log('Request URL:', request.url);
    
    const {data, error} = await supabase
      .from('products')
      .select('*');
    
    if(error) {
      console.error('Error fetching products:', error.message);
      return Response.json({ error: error.message }, { status: 400 });
    }
    
    return Response.json(data || []);
  } catch (error: any) {
    console.error('Unexpected error in GET handler:', error.message);
    return Response.json({ 
      error: "Server error while fetching products", 
      details: error.message 
    }, { status: 500 });
  }
}

// Create a new product
export async function POST(request: Request) {
  try {
    console.log('Creating new product');
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
      return Response.json({ 
        error: "Missing required fields", 
        details: "Name and price are required" 
      }, { status: 400 });
    }
    
    const { error, data: newProduct } = await supabase
      .from('products')
      .insert({
        name: body.name,
        image: body.image,
        price: body.price,
      })
      .select()
      .single();

    if(error) {
      console.error('Error creating product:', error.message);
      return Response.json({ error: error.message }, { status: 400 });
    }
    
    return Response.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error in POST handler:', error.message);
    return Response.json({ 
      error: "Server error while creating product", 
      details: error.message 
    }, { status: 500 });
  }
}
