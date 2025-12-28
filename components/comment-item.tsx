import { Card } from "@/components/ui/card"

interface Props {
  comment: {
    comment: string
    files: string[]
    created_at: string
    user: {
      email: string
      name?: string
    }
  }
}

export function CommentItem({ comment }: Props) {
  return (
    <Card className="p-4 space-y-2 bg-secondary/20">
      <div className="flex justify-between items-center">
        <p className="font-medium text-sm">
          {comment.user.name || comment.user.email}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(comment.created_at).toLocaleString()}
        </p>
      </div>

      <p className="text-sm">{comment.comment}</p>

      {comment.files?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
          {comment.files.map((file, i) => (
            <img
              key={i}
              src={file}
              alt="Comment attachment"
              className="h-24 w-full object-cover rounded border"
            />
          ))}
        </div>
      )}
    </Card>
  )
}
