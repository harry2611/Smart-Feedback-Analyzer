# Build stage
FROM node:18 as build

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g react-scripts@5.0.1

# Copy source files
COPY . .

# Install eslint and its plugins globally
RUN npm install -g eslint eslint-config-react-app \
    @babel/plugin-proposal-private-property-in-object \
    eslint-plugin-flowtype eslint-plugin-import \
    eslint-plugin-jsx-a11y eslint-plugin-react \
    eslint-plugin-react-hooks

# Build the application
RUN DISABLE_ESLINT_PLUGIN=true CI=false npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
