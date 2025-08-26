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

# Stage 1: Build tools and dependencies
FROM ubuntu:22.04 AS builder

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN apt-get update && \
    apt-get install -y \
        make=4.3-4.1build1 \
        curl=7.81.0-1ubuntu1.10 \
        ca-certificates \
        unzip=6.0-26ubuntu3.1 \
        jq=1.6-2.1ubuntu3 \
        --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    chmod +x ./kubectl && \
    mv ./kubectl /usr/local/bin/kubectl

# Stage 2: Runtime image
FROM ubuntu:22.04 AS runtime

# Copy only necessary binaries from builder
COPY --from=builder /usr/local/bin/kubectl /usr/local/bin/kubectl
COPY --from=builder /usr/bin/make /usr/bin/make
COPY --from=builder /usr/bin/curl /usr/bin/curl
COPY --from=builder /usr/bin/jq /usr/bin/jq
COPY --from=builder /usr/bin/unzip /usr/bin/unzip

# Install minimal runtime dependencies
RUN apt-get update && \
    apt-get install -y \
        ca-certificates \
        bash \
        --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    export PATH="/usr/local/bin:$PATH"

# Copy application files
COPY src /src
COPY Makefile /

# Set executable permissions
RUN chmod -R +x /src

CMD [ "make", "all" ]
