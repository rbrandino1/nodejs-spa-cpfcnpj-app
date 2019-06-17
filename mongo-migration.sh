echo "Creating collection and indexes..."

COLLECTION_NAME='documents'
COMMAND="
  db.runCommand({
    createIndexes: '$COLLECTION_NAME',
    indexes: [
      { name: 'cpfcnpj', key: { cpfcnpj: 1 } },
      { name: 'type', key: { type: 1 } },
      { name: 'active', key: { active: 1 } },
      { name: 'created', key: { created: 1 } }
    ]
  })
"
docker-compose exec -T mongo mongo brazilian-documents --eval "$COMMAND"

if [ $? -eq 0 ]
then
  echo "Successfully created collection"
  exit 0
else
  echo "Could not create collection" >&2
  exit 1
fi
