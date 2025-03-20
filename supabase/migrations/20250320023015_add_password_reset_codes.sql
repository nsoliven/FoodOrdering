create sequence "public"."password_reset_codes_id_seq";

create table "public"."password_reset_codes" (
    "id" integer not null default nextval('password_reset_codes_id_seq'::regclass),
    "email" text not null,
    "code" text not null,
    "created_at" timestamp with time zone not null,
    "expires_at" timestamp with time zone not null
);


alter table "public"."password_reset_codes" enable row level security;

alter sequence "public"."password_reset_codes_id_seq" owned by "public"."password_reset_codes"."id";

CREATE UNIQUE INDEX password_reset_codes_email_key ON public.password_reset_codes USING btree (email);

CREATE UNIQUE INDEX password_reset_codes_pkey ON public.password_reset_codes USING btree (id);

alter table "public"."password_reset_codes" add constraint "password_reset_codes_pkey" PRIMARY KEY using index "password_reset_codes_pkey";

alter table "public"."password_reset_codes" add constraint "password_reset_codes_email_key" UNIQUE using index "password_reset_codes_email_key";

grant delete on table "public"."password_reset_codes" to "anon";

grant insert on table "public"."password_reset_codes" to "anon";

grant references on table "public"."password_reset_codes" to "anon";

grant select on table "public"."password_reset_codes" to "anon";

grant trigger on table "public"."password_reset_codes" to "anon";

grant truncate on table "public"."password_reset_codes" to "anon";

grant update on table "public"."password_reset_codes" to "anon";

grant delete on table "public"."password_reset_codes" to "authenticated";

grant insert on table "public"."password_reset_codes" to "authenticated";

grant references on table "public"."password_reset_codes" to "authenticated";

grant select on table "public"."password_reset_codes" to "authenticated";

grant trigger on table "public"."password_reset_codes" to "authenticated";

grant truncate on table "public"."password_reset_codes" to "authenticated";

grant update on table "public"."password_reset_codes" to "authenticated";

grant delete on table "public"."password_reset_codes" to "service_role";

grant insert on table "public"."password_reset_codes" to "service_role";

grant references on table "public"."password_reset_codes" to "service_role";

grant select on table "public"."password_reset_codes" to "service_role";

grant trigger on table "public"."password_reset_codes" to "service_role";

grant truncate on table "public"."password_reset_codes" to "service_role";

grant update on table "public"."password_reset_codes" to "service_role";

create policy "Users can manage their own reset codes"
on "public"."password_reset_codes"
as permissive
for all
to authenticated, anon
using (true)
with check (true);



