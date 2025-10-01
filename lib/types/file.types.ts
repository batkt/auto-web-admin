export interface FileMetadata {
    duration?: number;
    mimetype: string;
    size: number;
}

export interface File {
    _id: string;
    originalName: string;
    filename: string;
    url: string;
    isActive: boolean;
    metadata: FileMetadata;
    uploadedBy?: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface FileListResponse {
    files: File[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface UploadFileResponse {
    file: File;
}

export interface UpdateFileStatusRequest {
    isActive: boolean;
} 