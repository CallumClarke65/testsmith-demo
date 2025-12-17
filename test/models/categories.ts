interface Categories {
    id: string,
    name: string,
    slug: string,
    parent_id: string | null,
    sub_categories: Categories[]
}