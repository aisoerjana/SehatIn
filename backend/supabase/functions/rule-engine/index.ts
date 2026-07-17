import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { gender, weight_kg, height_cm, age, goal } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Tidak terautentikasi");
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) throw new Error("Tidak terautentikasi");

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      gender,
      weight_kg,
      height_cm,
      age,
      goal,
    }, { onConflict: "id" });
    if (profileError) throw profileError;

    const heightM = height_cm / 100;
    const bmi = Math.round((weight_kg / (heightM * heightM)) * 10) / 10;

    let bmr: number;
    if (gender === "laki-laki") {
      bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
    } else {
      bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
    }

    const tdee = Math.round(bmr * 1.2);

    let calorie_target: number;
    if (goal === "cutting") {
      calorie_target = tdee - 500;
    } else if (goal === "bulking") {
      calorie_target = tdee + 500;
    } else {
      calorie_target = tdee;
    }

    let protein_per_kg: number;
    if (goal === "cutting") {
      protein_per_kg = 2.2;
    } else if (goal === "bulking") {
      protein_per_kg = 2.0;
    } else {
      protein_per_kg = 1.6;
    }

    const protein_g = Math.round(protein_per_kg * weight_kg * 10) / 10;
    const fat_g = Math.round((calorie_target * 0.25 / 9) * 10) / 10;
    const carb_kalori = calorie_target - (protein_g * 4) - (fat_g * 9);
    const carbs_g = Math.round((carb_kalori / 4) * 10) / 10;
    const fiber_g = 30;
    const sugar_max_g = 50;
    const water_liter = Math.round(weight_kg * 0.033 * 100) / 100;

    await supabase
      .from("macro_targets")
      .update({ is_active: false })
      .eq("profile_id", user.id)
      .eq("is_active", true);

    const { data: macroTarget, error: mtError } = await supabase
      .from("macro_targets")
      .insert({
        profile_id: user.id,
        height_cm,
        weight_kg,
        age,
        tdee,
        calorie_target,
        bmi,
        protein_g,
        protein_per_kg,
        carbs_g,
        fat_g,
        fiber_g,
        sugar_max_g,
        water_liter,
        is_active: true,
      })
      .select()
      .single();
    if (mtError) throw mtError;

    const { data: foodCatalog, error: fcError } = await supabase
      .from("food_catalog")
      .select("*");
    if (fcError) throw fcError;

    return new Response(
      JSON.stringify({
        status: "success",
        macro_target: macroTarget,
        food_catalog: foodCatalog,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
