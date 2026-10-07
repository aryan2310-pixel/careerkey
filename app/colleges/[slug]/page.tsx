export default async function SingleCollege({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
 
  return (
    <div>
      <h1>{slug}</h1>
      <p>{`welcome to ${slug}`}</p>
    </div>
  )
}