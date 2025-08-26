# Copyright (c) 2023, Xgrid Inc, https://xgrid.co

# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

# http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Stage 1: Build React app
FROM node:16-alpine AS builder

WORKDIR /app

# Copy React app package files
COPY client/package*.json ./client/
WORKDIR /app/client

# Install dependencies and build React app
RUN npm ci --only=production && npm run build

# Stage 2: Production Node.js server
FROM node:16-alpine AS production

WORKDIR /app

# Copy API package files and install dependencies
COPY api/package*.json ./
RUN npm ci --only=production

# Copy API source code
COPY api .

# Copy built React app from builder stage
COPY --from=builder /app/client/build ./build

# Expose port 3000 for the Node.js app
EXPOSE 3000

# Start the Node.js app when the container starts
CMD ["node", "index.js"]
