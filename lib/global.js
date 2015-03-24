/**
 * Slingshot file restrictions configuration
 */
Slingshot.fileRestrictions("userCoverUpload", {
	allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
	maxSize: 2 * 1024 * 1024 // 2 MB (use null for unlimited)
});

Slingshot.fileRestrictions("userAvatarUpload", {
	allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
	maxSize: 2 * 1024 * 1024 // 2 MB (use null for unlimited)
});