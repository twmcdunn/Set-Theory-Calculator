#!/bin/bash

# Build and Deploy Script
# This script builds a Maven + Node.js project and optionally deploys to GitHub Pages

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Git based on OS
install_git() {
    log_info "Git is not installed. Attempting to install..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command_exists apt-get; then
            sudo apt-get update && sudo apt-get install -y git
        elif command_exists yum; then
            sudo yum install -y git
        elif command_exists dnf; then
            sudo dnf install -y git
        elif command_exists pacman; then
            sudo pacman -S --noconfirm git
        else
            log_error "Unable to install Git automatically. Please install Git manually."
            exit 1
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        if command_exists brew; then
            brew install git
        else
            log_error "Homebrew not found. Please install Git manually or install Homebrew first."
            exit 1
        fi
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        log_error "Please install Git for Windows manually from https://git-scm.com/download/win"
        exit 1
    else
        log_error "Unsupported OS. Please install Git manually."
        exit 1
    fi
}

# Function to check and setup Git
setup_git() {
    if ! command_exists git; then
        read -p "Git is not installed. Would you like to install it? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_git
            if ! command_exists git; then
                log_error "Git installation failed."
                exit 1
            fi
            log_success "Git installed successfully."
        else
            log_error "Git is required for deployment. Exiting."
            exit 1
        fi
    fi
    
    # Check if Git is configured
    if ! git config --global user.name >/dev/null 2>&1; then
        log_warning "Git user name not configured."
        read -p "Enter your Git username: " git_username
        git config --global user.name "$git_username"
    fi
    
    if ! git config --global user.email >/dev/null 2>&1; then
        log_warning "Git email not configured."
        read -p "Enter your Git email: " git_email
        git config --global user.email "$git_email"
    fi
}

# Function to check GitHub CLI and authenticate
setup_github_cli() {
    if ! command_exists gh; then
        log_info "GitHub CLI is not installed. Installing..."
        
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            if command_exists apt-get; then
                curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
                echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
                sudo apt-get update && sudo apt-get install -y gh
            elif command_exists yum; then
                sudo dnf install -y 'dnf-command(config-manager)'
                sudo dnf config-manager --add-repo https://cli.github.com/packages/rpm/gh-cli.repo
                sudo dnf install -y gh
            fi
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            if command_exists brew; then
                brew install gh
            fi
        fi
        
        if ! command_exists gh; then
            log_error "Failed to install GitHub CLI. Please install it manually."
            exit 1
        fi
    fi
    
    # Check if authenticated
    if ! gh auth status >/dev/null 2>&1; then
        log_info "GitHub CLI authentication required."
        gh auth login
    fi
}

# Function to build Maven project
build_maven() {
    log_info "Starting Maven build..."
    if ! command_exists mvn; then
        log_error "Maven is not installed. Please install Maven first."
        exit 1
    fi
    
    mvn clean package
    log_success "Maven build completed."
}

# Function to build Node.js project
build_nodejs() {
    log_info "Building Node.js frontend..."
    
    if [ ! -d "../frontend/app" ]; then
        log_error "frontend/app directory not found!"
        exit 1
    fi
    
    cd ../frontend/app

    pwd
    
    if ! command_exists npm; then
        log_error "npm is not installed. Please install Node.js and npm first."
        exit 1
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        log_info "Installing npm dependencies..."
        npm install
    fi
    
    npm run build
    log_success "Frontend build completed."
    
    # Check if build directory exists
    if [ ! -d "build" ]; then
        log_error "Build directory not found after npm run build!"
        exit 1
    fi
    
    cd - > /dev/null  # Return to original directory
}

# Function to check if repository exists
check_repo_exists() {
    local repo_name="$1"
    local username=$(gh api user --jq .login)
    
    if gh repo view "$username/$repo_name" >/dev/null 2>&1; then
        return 0  # Repository exists
    else
        return 1  # Repository doesn't exist
    fi
}

# Function to create GitHub repository and deploy
deploy_to_github() {
    local repo_name
    read -p "Enter the GitHub repository name: " repo_name
    
    if [ -z "$repo_name" ]; then
        log_error "Repository name cannot be empty."
        return 1
    fi
    
    local username=$(gh api user --jq .login)
    local repo_exists=false
    
    # Check if repository already exists
    if check_repo_exists "$repo_name"; then
        repo_exists=true
        log_warning "Repository '$repo_name' already exists in your GitHub account."
        echo
        read -p "Do you want to replace its contents with the new build? (y/n): " -n 1 -r
        echo
        
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Deployment cancelled by user."
            return 0
        fi
    fi
    
    log_info "Setting up GitHub repository: $repo_name"
    
    # Create a temporary directory for deployment
    local deploy_dir="temp_deploy_$$"
    mkdir "$deploy_dir"
    
    # Copy build files to deployment directory
    cp -r ../frontend/app/build/* "$deploy_dir/"
    
    cd "$deploy_dir"
    
    if [ "$repo_exists" = true ]; then
        log_info "Cloning existing repository to preserve history..."
        
        # Clone the existing repository
        git clone "https://github.com/$username/$repo_name.git" temp_clone
        
        # Copy the .git directory to preserve history
        if [ -d "temp_clone/.git" ]; then
            cp -r temp_clone/.git ./
            rm -rf temp_clone
            
            # Clean the repository (remove all files except .git)
            find . -maxdepth 1 ! -name '.' ! -name '..' ! -name '.git' -exec rm -rf {} +
            
            pwd 

            # Copy new build files
            cp -r ../../frontend/app/build/* ./
        else
            log_warning "Could not preserve git history. Initializing new repository."
            git init
        fi
    else
        # Initialize new git repository
        git init
        
        # Create GitHub repository
        log_info "Creating GitHub repository..."
        if gh repo create "$repo_name" --public --confirm; then
            log_success "GitHub repository created successfully."
        else
            log_error "Failed to create GitHub repository."
            cd - > /dev/null
            rm -rf "$deploy_dir"
            return 1
        fi
    fi
    
    # Stage all files
    git add .
    
    # Check if there are any changes to commit
    if git diff --cached --quiet; then
        log_info "No changes detected. Repository is already up to date."
        cd - > /dev/null
        rm -rf "$deploy_dir"
        return 0
    fi
    
    # Commit changes
    if [ "$repo_exists" = true ]; then
        git commit -m "Update: Deploy new build to GitHub Pages"
    else
        git commit -m "Initial commit - Deploy to GitHub Pages"
    fi
    
    # Set up remote if it doesn't exist
    if ! git remote get-url origin >/dev/null 2>&1; then
        git remote add origin "https://github.com/$username/$repo_name.git"
    fi
    
    # Ensure we're on the main branch
    git branch -M main
    
    # Push to GitHub
    log_info "Pushing code to GitHub..."
    if [ "$repo_exists" = true ]; then
        # Force push to replace existing contents
        git push -f origin main
    else
        git push -u origin main
    fi
    
    # Enable GitHub Pages if repository is new or if pages are not enabled
    log_info "Configuring GitHub Pages..."
    if gh api "repos/$username/$repo_name/pages" >/dev/null 2>&1; then
        log_info "GitHub Pages is already enabled."
    else
        log_info "Enabling GitHub Pages..."
        if gh api "repos/$username/$repo_name/pages" \
            --method POST \
            --field source[branch]="main" \
            --field source[path]="/" \
            --field build_type="legacy" 2>/dev/null; then
            log_success "GitHub Pages enabled successfully."
        else
            # Try alternative method with raw JSON
            log_info "Trying alternative GitHub Pages configuration..."
            curl -L \
                -X POST \
                -H "Accept: application/vnd.github+json" \
                -H "Authorization: Bearer $(gh auth token)" \
                -H "X-GitHub-Api-Version: 2022-11-28" \
                "https://api.github.com/repos/$username/$repo_name/pages" \
                -d '{"source":{"branch":"main","path":"/"},"build_type":"legacy"}' 2>/dev/null || \
                log_warning "GitHub Pages configuration failed. You may need to enable it manually in the repository settings."
        fi
    fi
    
    cd - > /dev/null
    rm -rf "$deploy_dir"
    
    log_success "Deployment completed!"
    echo -e "${GREEN}Your site will be available at: https://$username.github.io/$repo_name${NC}"
    echo -e "${YELLOW}Note: It may take a few minutes for the site to become available.${NC}"
}

# Main execution
main() {
    log_info "Starting build process..."
    
    # Check if we're in a project directory
    if [ ! -f "pom.xml" ]; then
        log_error "pom.xml not found. Are you in the correct project directory?"
        exit 1
    fi
    
    # Build Maven project
    build_maven
    
    # Build Node.js frontend
    build_nodejs
    
    log_success "All builds completed successfully!"
    
    # Ask user about deployment
    echo
    read -p "Would you like to deploy this project to GitHub Pages? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Setting up deployment to GitHub..."
        
        # Setup Git and GitHub CLI
        setup_git
        setup_github_cli
        
        # Deploy to GitHub
        deploy_to_github
    else
        log_info "Deployment skipped. Build files are ready in frontend/app/build/"
    fi
    
    log_success "Script completed successfully!"
}

# Run main function
main "$@"