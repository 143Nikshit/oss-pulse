// A simple function to call the GitHub REST API
async function fetchData() {
    const repoIdentifier = document.getElementById('repoInput').value;
    const dashboard = document.getElementById('dashboard');
    const errorMessage = document.getElementById('errorMessage');

    // Basic validation
    if (!repoIdentifier.includes('/')) {
        showError("Please use the format 'owner/repo'");
        return;
    }

    // Show loading state? You can add a spinner here later.
    console.log(`Fetching data for: ${repoIdentifier}`);

    try {
        const response = await fetch(`https://api.github.com/repos/${repoIdentifier}`);
        const data = await response.json();

        if (response.status !== 200) {
            showError(`Error: ${data.message || 'Repository not found'}`);
            return;
        }

        // Hide error, show dashboard, and update the UI
        errorMessage.classList.add('hidden');
        updateDashboard(data);
        dashboard.classList.remove('hidden');

    } catch (error) {
        showError('A network error occurred. Please try again.');
        console.error('Fetch error:', error);
    }
}

function updateDashboard(repoData) {
    document.getElementById('repoName').textContent = repoData.full_name;
    document.getElementById('stars').textContent = repoData.stargazers_count.toLocaleString();
    document.getElementById('forks').textContent = repoData.forks_count.toLocaleString();
    document.getElementById('openIssues').textContent = repoData.open_issues_count.toLocaleString();

    const updatedDate = new Date(repoData.updated_at).toLocaleDateString();
    document.getElementById('updatedAt').textContent = updatedDate;
    document.getElementById('license').textContent = repoData.license?.spdx_id || 'None';
}

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

// Optional: Allow user to press "Enter" to fetch data
document.getElementById('repoInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        fetchData();
    }
});