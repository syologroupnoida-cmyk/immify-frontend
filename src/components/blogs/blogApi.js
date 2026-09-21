import MainApi from '@/util/MainApi';

export const BLOGS_ENDPOINT = '/admin/blogs';

export function getBlogId(blog) {
    return String(blog?.blogId || blog?.id || blog?._id || blog?.uuid || '');
}

export function unwrapBlog(payload) {
    const data = payload?.data ?? payload;
    return data?.blog || data?.item || data?.result || data;
}

export function unwrapBlogs(payload) {
    const data = payload?.data ?? payload;
    const rows = [data, data?.items, data?.content, data?.results, data?.rows, data?.list, data?.blogs,
        data?.data, data?.data?.items, data?.data?.content, data?.data?.results, data?.data?.rows, data?.data?.blogs]
        .find(Array.isArray) || [];
    const total = data?.total ?? data?.totalElements ?? data?.totalCount ?? data?.count
        ?? data?.pagination?.total ?? data?.meta?.total
        ?? data?.data?.total ?? data?.data?.totalElements ?? data?.data?.pagination?.total ?? rows.length;
    return { rows, total: Number(total) || 0 };
}

export function getBlogError(error) {
    return error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Unable to save blog.';
}

export async function fetchBlog(id) {
    const response = await MainApi.get(`${BLOGS_ENDPOINT}/${encodeURIComponent(id)}`);
    return unwrapBlog(response.data);
}
