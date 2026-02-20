import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Get all users
    const { data: profiles } = await supabase.from("profiles").select("id, favorite_genre");

    // Featured movies to notify about
    const OMDB_KEY = "57003d72";
    const queries = ["2025", "new", "latest"];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];

    const res = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${randomQuery}&type=movie`);
    const data = await res.json();

    if (data.Response !== "True" || !data.Search?.length) {
      return new Response(JSON.stringify({ message: "No movies found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const movie = data.Search[Math.floor(Math.random() * data.Search.length)];
    let notificationCount = 0;

    for (const profile of profiles || []) {
      await supabase.from("notifications").insert({
        user_id: profile.id,
        title: `🎬 New on Netflux: ${movie.Title}`,
        message: `${movie.Title} (${movie.Year}) is now available. Watch it now!`,
        movie_id: movie.imdbID,
        read: false,
      });
      notificationCount++;
    }

    return new Response(
      JSON.stringify({ message: `Sent ${notificationCount} notifications for ${movie.Title}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
