import { EyeIcon, MoreVerticalIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Row-level actions for admin tables. Edit/view/delete are stubs for now.
export function RowActions({ label = 'record' }: { label?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground data-[state=open]:bg-muted"
        >
          <MoreVerticalIcon />
          <span className="sr-only">Open actions for {label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem>
          <EyeIcon className="text-muted-foreground" /> View
        </DropdownMenuItem>
        <DropdownMenuItem>
          <PencilIcon className="text-muted-foreground" /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <Trash2Icon className="text-destructive" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
