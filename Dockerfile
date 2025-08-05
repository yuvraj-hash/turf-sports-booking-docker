# Step 1: Build the React (Vite) app
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build arguments to receive environment variables from Render
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_RAZORPAY_KEY_ID
ARG VITE_RESEND_API_KEY
ARG APP_URL
ARG FROM_EMAIL

# Set environment variables for the build process
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID
ENV VITE_RESEND_API_KEY=$VITE_RESEND_API_KEY
ENV APP_URL=$APP_URL
ENV FROM_EMAIL=$FROM_EMAIL

RUN npm run build

# Step 2: Use Nginx to serve the build
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
